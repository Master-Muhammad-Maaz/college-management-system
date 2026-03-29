const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// --- NEW: BULK SYNC ROUTE (Frontend "Sync Records" ke liye) ---
router.post("/bulk-sync", async (req, res) => {
  try {
    const { date, course, records } = req.body; // records: { id: 'P' }
    
    const operations = Object.entries(records).map(([studentId, statusAbbr]) => {
      // Mapping P, A, H to Schema Enum values
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

    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: "Records synced to database!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- FIXED: EXCEL EXPORT (URL Match with Frontend) ---
router.get("/export", async (req, res) => {
  try {
    const { course, date } = req.query; // Query params from Frontend
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

    allDates.forEach(d => {
      columns.push({ header: d.split('-').reverse().join('-'), key: d, width: 15 });
    });

    columns.push(
      { header: "Present", key: "pCount", width: 10 },
      { header: "Absent", key: "aCount", width: 10 },
      { header: "Percentage", key: "percentage", width: 15 }
    );

    worksheet.columns = columns;

    students.forEach(student => {
      const studentAt = attendanceRecords.filter(r => r.studentId.toString() === student._id.toString());
      let rowData = { srNo: student.srNo, name: student.name };
      let p = 0, a = 0;

      allDates.forEach(d => {
        const record = studentAt.find(r => r.date === d);
        rowData[d] = record ? record.status : "-";
        if (record?.status === "Present") p++;
        if (record?.status === "Absent") a++;
      });

      rowData.pCount = p;
      rowData.aCount = a;
      rowData.percentage = (p+a > 0) ? `${((p/(p+a))*100).toFixed(2)}%` : "0%";
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

module.exports = router;
