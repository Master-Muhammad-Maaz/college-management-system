const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. BULK SYNC (Existing Logic - No Change)
router.post("/bulk-sync", async (req, res) => {
  try {
    const { date, course, records } = req.body;
    const operations = Object.entries(records).map(([studentId, statusAbbr]) => {
      let fullStatus = "Present";
      if (statusAbbr === 'A') fullStatus = "Absent";
      if (statusAbbr === 'H') fullStatus = "Holiday";

      return {
        updateOne: {
          filter: { studentId, date },
          update: { studentId, date, status: fullStatus, course },
          upsert: true
        }
      };
    });
    if (operations.length === 0) return res.status(400).json({ success: false, message: "No records" });
    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: "Attendance synced successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Mark Single Attendance (Existing Logic)
router.post("/mark", async (req, res) => {
  try {
    const { studentId, date, status, course } = req.body;
    const record = await Attendance.findOneAndUpdate(
      { studentId, date },
      { studentId, date, status, course },
      { upsert: true, new: true }
    );
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get Attendance Today (Existing Logic)
router.get("/today/:date/:course", async (req, res) => {
  try {
    const { date, course } = req.params;
    const records = await Attendance.find({ date, course });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Detailed Excel Export (Existing Logic)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    if (!course) return res.status(400).send("Course required.");
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });
    if (!students.length) return res.status(404).send("No students found.");

    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    let columns = [
      { header: "Sr.no", key: "srNo", width: 10 },
      { header: "Student Name", key: "name", width: 30 },
    ];
    allDates.forEach(date => {
      columns.push({ header: date.split('-').reverse().join('-'), key: date, width: 15 });
    });
    columns.push(
      { header: "P", key: "pCount", width: 10 },
      { header: "A", key: "aCount", width: 10 },
      { header: "H", key: "hCount", width: 10 },
      { header: "%", key: "percentage", width: 15 }
    );
    worksheet.columns = columns;

    students.forEach(student => {
      const studentAt = attendanceRecords.filter(r => r.studentId.toString() === student._id.toString());
      let rowData = { srNo: student.srNo, name: student.name };
      let p = 0, a = 0, h = 0;
      allDates.forEach(date => {
        const record = studentAt.find(r => r.date === date);
        if (record) {
          rowData[date] = record.status;
          if (record.status === "Present") p++;
          else if (record.status === "Absent") a++;
          else if (record.status === "Holiday") h++;
        }
      });
      const total = p + a;
      rowData.pCount = p; rowData.aCount = a; rowData.hCount = h;
      rowData.percentage = total > 0 ? `${((p / total) * 100).toFixed(1)}%` : "0%";
      worksheet.addRow(rowData);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).send("Export Error: " + err.message);
  }
});

// 5. [NEW] SWIPE-SESSION ATTENDANCE 
// Ye route aapke animated cards ka sara data ek baar mein save karega
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    // attendanceData format: [{ studentId: "ID", status: "Present" }, ...]

    const operations = attendanceData.map(item => ({
      updateOne: {
        filter: { studentId: item.studentId, date: date },
        update: { 
          studentId: item.studentId, 
          date: date, 
          status: item.status, 
          course: course 
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: `Attendance updated for ${attendanceData.length} students.` });
  } catch (err) {
    console.error("Swipe Session Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
