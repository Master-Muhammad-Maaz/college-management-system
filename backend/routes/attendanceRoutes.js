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

    const operations = students.map(student => ({
      updateOne: {
        filter: { studentId: student._id, date },
        update: { studentId: student._id, date, status: "Holiday", course },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: `Holiday marked for ${course}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. CLEAR ATTENDANCE ONLY (Internal use)
router.delete("/clear-batch", async (req, res) => {
  try {
    const { course } = req.query;
    await Attendance.deleteMany({ course });
    res.json({ success: true, message: "Attendance cleared" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 3. SWIPE-SESSION ATTENDANCE
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    const operations = attendanceData.map(item => ({
      updateOne: {
        filter: { studentId: item.studentId, date: date },
        update: { studentId: item.studentId, date: date, status: item.status, course: course },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: "Attendance updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 4. TODAY STATUS
router.get("/today/:date/:course", async (req, res) => {
  try {
    const { date, course } = req.params;
    const records = await Attendance.find({ date, course });
    res.json({ success: true, records });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 5. SMART EXCEL EXPORT (Formula Fix: P / (P+A))
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    let columns = [
      { header: "Sr.no", key: "srNo", width: 10 },
      { header: "Student Name", key: "name", width: 30 },
    ];
    allDates.forEach(date => columns.push({ header: date.split('-').reverse().join('-'), key: date, width: 12 }));
    columns.push({ header: "P", key: "pCount" }, { header: "A", key: "aCount" }, { header: "H", key: "hCount" }, { header: "%", key: "percentage", width: 12 });
    worksheet.columns = columns;

    students.forEach(student => {
      const studentAt = attendanceRecords.filter(r => r.studentId.toString() === student._id.toString());
      let rowData = { srNo: student.srNo, name: student.name };
      let p = 0, a = 0, h = 0;
      allDates.forEach(date => {
        const record = studentAt.find(r => r.date === date);
        if (record) {
          rowData[date] = record.status === "Present" ? "P" : record.status === "Absent" ? "A" : "H";
          if (record.status === "Present") p++;
          else if (record.status === "Absent") a++;
          else h++;
        }
      });
      const totalForCalc = p + a; // Excluding Holidays
      rowData.pCount = p; rowData.aCount = a; rowData.hCount = h;
      rowData.percentage = totalForCalc > 0 ? `${((p / totalForCalc) * 100).toFixed(2)}%` : "0%";
      worksheet.addRow(rowData);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;
