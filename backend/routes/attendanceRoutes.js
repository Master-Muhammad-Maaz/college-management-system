const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. BULK SYNC (Frontend "Sync Records" Button ke liye)
// Ye route P, A, H ko Present, Absent, Holiday mein convert karke save karega
router.post("/bulk-sync", async (req, res) => {
  try {
    const { date, course, records } = req.body; // records format: { "studentId": "P" }

    const operations = Object.entries(records).map(([studentId, statusAbbr]) => {
      // Mapping Abbreviations to Schema Enums
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

    if (operations.length === 0) {
      return res.status(400).json({ success: false, message: "No records provided" });
    }

    await Attendance.bulkWrite(operations);
    res.json({ success: true, message: "Attendance synced successfully!" });
  } catch (err) {
    console.error("Bulk Sync Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Mark Single Attendance (Optional/Existing)
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

// 3. Get Attendance Today
router.get("/today/:date/:course", async (req, res) => {
  try {
    const { date, course } = req.params;
    const records = await Attendance.find({ date, course });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. DETAILED EXCEL EXPORT (Updated to handle Frontend Query Params)
router.get("/export", async (req, res) => {
  try {
    // Frontend se 'course' query param mein aa raha hai
    const { course } = req.query; 

    if (!course) return res.status(400).send("Course is required for export.");

    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });

    if (!students.length) {
      return res.status(404).send("Is course mein koi students nahi hain.");
    }

    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    // Column Configuration
    let columns = [
      { header: "Sr.no", key: "srNo", width: 10 },
      { header: "Student Name", key: "name", width: 30 },
    ];

    allDates.forEach(date => {
      const formattedHeader = date.split('-').reverse().join('-'); 
      columns.push({ header: formattedHeader, key: date, width: 15 });
    });

    columns.push(
      { header: "Total Present", key: "pCount", width: 15 },
      { header: "Total Absent", key: "aCount", width: 15 },
      { header: "Total Holidays", key: "hCount", width: 15 },
      { header: "Percentage (%)", key: "percentage", width: 15 }
    );

    worksheet.columns = columns;

    // Data Row Generation
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
        } else {
          rowData[date] = "-";
        }
      });

      const totalWorking = p + a;
      const percent = totalWorking > 0 ? ((p / totalWorking) * 100).toFixed(2) : "0.00";

      rowData.pCount = p;
      rowData.aCount = a;
      rowData.hCount = h;
      rowData.percentage = `${percent}%`;

      worksheet.addRow(rowData);
    });

    // Styling
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Attendance_Report.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).send("Backend Error: " + err.message);
  }
});

module.exports = router;
