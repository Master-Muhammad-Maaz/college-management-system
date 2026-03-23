const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. Mark Single Attendance
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

// 2. Mark Holiday for Entire Course
router.post("/mark-holiday", async (req, res) => {
  try {
    const { date, course } = req.body;
    const students = await StudentRecord.find({ course });
    if (students.length === 0) return res.status(404).json({ success: false, message: "No students found." });

    const holidayOperations = students.map(st => ({
      updateOne: {
        filter: { studentId: st._id, date: date },
        update: { studentId: st._id, date: date, status: "Holiday", course: course },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(holidayOperations);
    res.json({ success: true, message: `${course} Holiday Marked!` });
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

// 4. DETAILED EXCEL EXPORT (Date Format: 17-03-2026)
router.get("/export-report/:course", async (req, res) => {
  try {
    const { course } = req.params;
    
    // Data Fetching
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });

    if (!students.length) {
      return res.status(404).send("Is course mein koi students nahi hain.");
    }

    // Unique dates nikal kar sort karna
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    // Headers Setup (Sr.no aur Student Name)
    let columns = [
      { header: "Sr.no", key: "srNo", width: 10 },
      { header: "Student Name", key: "name", width: 30 },
    ];

    // Dates ko DD-MM-YYYY format mein convert karke headers mein daalna
    allDates.forEach(date => {
      const formattedHeader = date.split('-').reverse().join('-'); 
      columns.push({ header: formattedHeader, key: date, width: 15 });
    });

    // Final Summary columns (Jaisa aapne image mein manga tha)
    columns.push(
      { header: "No. Of Present Day", key: "pCount", width: 18 },
      { header: "No. Of Absent Day", key: "aCount", width: 18 },
      { header: "No. Of holidays", key: "hCount", width: 15 },
      { header: "attendance percentage", key: "percentage", width: 20 }
    );

    worksheet.columns = columns;

    // Row-by-row data filling
    students.forEach(student => {
      const studentAt = attendanceRecords.filter(r => r.studentId.toString() === student._id.toString());
      
      let rowData = {
        srNo: student.srNo,
        name: student.name
      };

      let p = 0, a = 0, h = 0;

      // Har unique date ke liye status check karke usey cell mein map karna
      allDates.forEach(date => {
        const record = studentAt.find(r => r.date === date);
        if (record) {
          // Yahan hum status ko uski date ki key ke sath save kar rahe hain
          if (record.status === "Present") { 
            rowData[date] = "Present"; 
            p++; 
          } else if (record.status === "Absent") { 
            rowData[date] = "Absent"; 
            a++; 
          } else if (record.status === "Holiday") { 
            rowData[date] = "Holiday"; 
            h++; 
          }
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

    // Excel Styling (Bold Blue Headers)
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // Final Response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).send("Backend Error: " + err.message);
  }
});

module.exports = router;