const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. HOLIDAY MODE
router.post("/holiday-mode", async (req, res) => {
  try {
    const { date, course } = req.body;
    
    await Attendance.findOneAndUpdate(
      { date, course },
      { date, course, isHoliday: true, attendanceData: [] },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: `Holiday marked for ${course}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. SWIPE-SESSION (Bulk Update)
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    
    const update = {
      date,
      course,
      isHoliday: false,
      attendanceData: attendanceData.map(item => ({
        studentId: item.studentId,
        status: item.status
      }))
    };
    
    await Attendance.findOneAndUpdate({ date, course }, update, { upsert: true });
    res.json({ success: true, message: "Attendance updated successfully" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 3. TODAY STATUS
router.get("/today/:date/:course", async (req, res) => {
  try {
    const { date, course } = req.params;
    const record = await Attendance.findOne({ date, course });
    res.json({ success: true, record });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 4. FINAL EXPORT (Fixed Mismatch)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    const allDates = [...new Set(attendanceRecords.map(r => r.date))];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // Headers
    const headers = ["sr.no", "student name", ...allDates, "total holiday's", "total present days", "total apsent days", "average percentage"];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    // Sub-header
    const subHeader = ["", "p/a/h", ...allDates.map(() => "p/a/h")];
    worksheet.addRow(subHeader);

    students.forEach(student => {
      let p = 0, a = 0, h = 0;
      let rowData = [student.srNo, student.name];

      allDates.forEach(date => {
        const dailyRecord = attendanceRecords.find(r => r.date === date);
        const studentStatus = dailyRecord?.attendanceData.find(at => at.studentId?.toString() === student._id.toString());
        
        if (dailyRecord?.isHoliday) {
          rowData.push("h"); h++;
        } else if (studentStatus) {
          const s = studentStatus.status.toLowerCase();
          if (s === "present") { rowData.push("p"); p++; }
          else if (s === "absent") { rowData.push("a"); a++; }
          else { rowData.push("-"); }
        } else {
          rowData.push("-");
        }
      });

      const total = p + a;
      const percentage = total > 0 ? `${((p / total) * 100).toFixed(2)}%` : "0%";
      rowData.push(h, p, a, percentage);
      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach(col => col.width = 15);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send("Export Error: " + err.message); }
});

module.exports = router;
