const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// FINAL SMART EXCEL EXPORT (Dynamic Dates & p/a/h format)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    
    // 1. Students aur Attendance Records fetch karein
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    // 2. Database se saari Unique Dates nikaalein (Columns ke liye)
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    // 3. Row 1: Main Headers Setup
    let headerRowValues = [
      "sr.no", 
      "student name", 
      ...allDates, 
      "total holiday's", 
      "total present days", 
      "total apsent days", 
      "average percentgae"
    ];
    
    const headerRow = worksheet.addRow(headerRowValues);
    
    // Header Styling (Bold & Center)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.border = { bottom: { style: 'thin' } };
    });

    // 4. Row 2: "p/a/h" Sub-header Indicator
    let subHeader = ["", "p/a/h"];
    allDates.forEach(() => subHeader.push("p/a/h"));
    const subHeaderRow = worksheet.addRow(subHeader);
    subHeaderRow.font = { italic: true, size: 10 };

    // 5. Students Data Processing
    students.forEach(student => {
      let pCount = 0, aCount = 0, hCount = 0;
      let rowData = [student.srNo, student.name];

      // Har date ke column mein data fill karein
      allDates.forEach(date => {
        const dailyRecord = attendanceRecords.find(r => r.date === date);
        const studentStatus = dailyRecord?.attendanceData.find(at => 
          at.studentId?.toString() === student._id.toString()
        );
        
        if (dailyRecord?.isHoliday) {
          rowData.push("h");
          hCount++;
        } else if (studentStatus) {
          const s = studentStatus.status.toLowerCase();
          if (s === "present") { 
            rowData.push("p"); pCount++; 
          } else if (s === "absent") { 
            rowData.push("a"); aCount++; 
          } else { 
            rowData.push("-"); 
          }
        } else {
          rowData.push("-");
        }
      });

      // Calculations
      const totalActiveDays = pCount + aCount;
      const percentage = totalActiveDays > 0 
        ? `${((pCount / totalActiveDays) * 100).toFixed(2)}%` 
        : "0%";
      
      // Footer Totals add karein
      rowData.push(hCount, pCount, aCount, percentage);
      worksheet.addRow(rowData);
    });

    // 6. Column Width Adjust karein
    worksheet.columns.forEach((col, index) => {
      if (index === 1) col.width = 30; // Student Name bada rakhein
      else col.width = 15;
    });

    // 7. Response Send karein
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Attendance_Report.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).send("Export Error: " + err.message);
  }
});

module.exports = router;
