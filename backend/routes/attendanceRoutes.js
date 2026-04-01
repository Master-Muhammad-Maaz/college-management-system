const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. HOLIDAY MODE
router.post("/holiday-mode", async (req, res) => {
  try {
    const { date, course } = req.body;
    const students = await StudentRecord.find({ course });
    if (students.length === 0) return res.status(400).json({ success: false, message: "No students found" });

    // Mark as Holiday for the whole course on this date
    const operation = {
      updateOne: {
        filter: { date, course },
        update: { date, course, isHoliday: true, attendanceData: [] },
        upsert: true
      }
    };
    await Attendance.bulkWrite([operation]);
    res.json({ success: true, message: `Holiday marked for ${course}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. SWIPE-SESSION ATTENDANCE (From Swipe Cards)
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
    res.json({ success: true, message: "Attendance updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 3. TODAY STATUS CHECK
router.get("/today/:date/:course", async (req, res) => {
  try {
    const { date, course } = req.params;
    const records = await Attendance.find({ date, course });
    res.json({ success: true, records });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 4. SMART EXCEL EXPORT (Matches your requirement exactly)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });
    
    // Sabhi Unique Dates nikaalein (Sorted)
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // Headers Setup
    let headerRowValues = ["sr.no", "student name", ...allDates, "total holiday's", "total present days", "total apsent days", "average percentgae"];
    const headerRow = worksheet.addRow(headerRowValues);
    headerRow.font = { bold: true };

    // Sub-header (p/a/h) row
    let subHeader = ["", "p/a/h"];
    allDates.forEach(() => subHeader.push("p/a/h"));
    worksheet.addRow(subHeader);

    // Students Data Rows
    students.forEach(student => {
      let p = 0, a = 0, h = 0;
      let rowData = [student.srNo, student.name];

      allDates.forEach(date => {
        const dailyRecord = attendanceRecords.find(r => r.date === date);
        const studentStatus = dailyRecord?.attendanceData.find(at => at.studentId.toString() === student._id.toString());
        
        if (dailyRecord?.isHoliday) {
          rowData.push("h");
          h++;
        } else if (studentStatus) {
          const status = studentStatus.status.toLowerCase();
          if (status === "present") { rowData.push("p"); p++; }
          else if (status === "absent") { rowData.push("a"); a++; }
          else { rowData.push("-"); }
        } else {
          rowData.push("-");
        }
      });

      const totalForCalc = p + a;
      const percentage = totalForCalc > 0 ? `${((p / totalForCalc) * 100).toFixed(2)}%` : "0%";
      
      rowData.push(h, p, a, percentage);
      worksheet.addRow(rowData);
    });

    // Formatting
    worksheet.columns.forEach(column => { column.width = 15; });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send("Export Error: " + err.message); }
});

module.exports = router;
