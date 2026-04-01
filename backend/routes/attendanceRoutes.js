const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. SWIPE-SESSION (Saves/Updates Full Batch)
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    
    // Debugging ke liye log
    console.log("Saving Attendance for:", date, course);

    if (!date || !course || !attendanceData) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const update = {
      date,
      course,
      isHoliday: false,
      attendanceData: attendanceData.map(item => ({
        studentId: item.studentId,
        status: item.status.toUpperCase() 
      }))
    };

    const result = await Attendance.findOneAndUpdate({ date, course }, update, { upsert: true, new: true });
    console.log("Save Success:", result._id);
    
    res.json({ success: true, message: "Attendance updated!" });
  } catch (err) { 
    console.error("Database Error:", err.message);
    res.status(500).json({ success: false, message: err.message }); 
  }
});

// 2. SMART EXCEL EXPORT
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    // Yahan check karein ke records mil rahe hain ya nahi
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].filter(Boolean).sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // Headers Setup
    let headers = ["SR. NO", "STUDENT NAME", ...allDates, "TOTAL HOLIDAYS", "TOTAL PRESENT", "TOTAL ABSENT", "PERCENTAGE"];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    students.forEach(student => {
      let pCount = 0, aCount = 0, hCount = 0;
      let rowData = [student.srNo, student.name];

      allDates.forEach(date => {
        const record = attendanceRecords.find(r => r.date === date);
        const sStatus = record?.attendanceData.find(at => at.studentId?.toString() === student._id.toString());
        
        if (record?.isHoliday) {
          rowData.push("H"); hCount++;
        } else if (sStatus) {
          const status = sStatus.status.toUpperCase();
          rowData.push(status === "PRESENT" ? "P" : "A");
          if (status === "PRESENT") pCount++; else aCount++;
        } else { rowData.push("-"); }
      });

      const total = pCount + aCount;
      const perc = total > 0 ? `${((pCount / total) * 100).toFixed(2)}%` : "0%";
      rowData.push(hCount, pCount, aCount, perc);
      worksheet.addRow(rowData);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
