const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. SWIPE-SESSION (Saves/Updates Full Batch)
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    const update = {
      date,
      course,
      isHoliday: false,
      attendanceData: attendanceData.map(item => ({
        studentId: item.studentId,
        status: item.status.toUpperCase() // Force Uppercase
      }))
    };
    await Attendance.findOneAndUpdate({ date, course }, update, { upsert: true });
    res.json({ success: true, message: "Attendance updated!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. SMART EXCEL EXPORT (Full Words & Dynamic Dates)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // Headers with Dynamic Dates
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
          rowData.push("HOLIDAY"); hCount++;
        } else if (sStatus) {
          const status = sStatus.status.toUpperCase();
          rowData.push(status);
          if (status === "PRESENT") pCount++; else if (status === "ABSENT") aCount++;
        } else { rowData.push("-"); }
      });

      const total = pCount + aCount;
      const perc = total > 0 ? `${((pCount / total) * 100).toFixed(2)}%` : "0%";
      rowData.push(hCount, pCount, aCount, perc);
      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach(col => { col.width = 20; });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
