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
        status: item.status.toUpperCase() // Hamesha PRESENT/ABSENT save hoga
      }))
    };
    // Unique entry per date and course
    await Attendance.findOneAndUpdate({ date, course }, update, { upsert: true });
    res.json({ success: true, message: "Attendance updated!" });
  } catch (err) { 
    res.status(500).json({ success: false, message: "Error saving attendance: " + err.message }); 
  }
});

// 2. SMART EXCEL EXPORT (Dynamic Dates & Full Status)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    
    // Data fetch karein
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    // Unique dates nikaalein jo columns banenge
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // --- ROW 1: MAIN HEADERS ---
    let headers = [
      "SR. NO", 
      "STUDENT NAME", 
      ...allDates, 
      "TOTAL HOLIDAYS", 
      "TOTAL PRESENT", 
      "TOTAL ABSENT", 
      "PERCENTAGE"
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // --- ROW 2: SUB-HEADERS (Status Indicator) ---
    // Jaisa image_9e707e.png mein tha: p/a/h indicator
    let subHeader = ["", "STATUS"];
    allDates.forEach(() => subHeader.push("p/a/h")); 
    const subHeaderRow = worksheet.addRow(subHeader);
    subHeaderRow.font = { italic: true, size: 9 };

    // --- DATA ROWS ---
    students.forEach(student => {
      let pCount = 0, aCount = 0, hCount = 0;
      let rowData = [student.srNo, student.name];

      allDates.forEach(date => {
        const dayRecord = attendanceRecords.find(r => r.date === date);
        const sStatus = dayRecord?.attendanceData.find(at => 
          at.studentId?.toString() === student._id.toString()
        );
        
        if (dayRecord?.isHoliday) {
          rowData.push("HOLIDAY"); 
          hCount++;
        } else if (sStatus) {
          const status = sStatus.status.toUpperCase();
          rowData.push(status); // "PRESENT" ya "ABSENT" fill hoga
          if (status === "PRESENT") pCount++; 
          else if (status === "ABSENT") aCount++;
        } else {
          rowData.push("-"); 
        }
      });

      // Percentage Calculate karein
      const totalDays = pCount + aCount;
      const perc = totalDays > 0 ? `${((pCount / totalDays) * 100).toFixed(2)}%` : "0%";
      
      // Totals add karein
      rowData.push(hCount, pCount, aCount, perc);
      worksheet.addRow(rowData);
    });

    // Formatting: Column width adjust karein
    worksheet.columns.forEach((col, index) => {
      if (index === 1) col.width = 30; // Student Name bada rakhein
      else col.width = 18; // Dates aur totals ke liye space
    });

    // Excel Download headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Report.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).send("Export Error: " + err.message);
  }
});

module.exports = router;
