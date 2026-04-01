const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// FINAL EXCEL EXPORT (Full Words: PRESENT, ABSENT, HOLIDAY)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    // 1. MAIN HEADERS (Capitalized)
    let headerRowValues = [
      "SR. NO", 
      "STUDENT NAME", 
      ...allDates, 
      "TOTAL HOLIDAYS", 
      "TOTAL PRESENT DAYS", 
      "TOTAL ABSENT DAYS", 
      "PERCENTAGE"
    ];
    
    const headerRow = worksheet.addRow(headerRowValues);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // 2. SUB-HEADER (Indicating Full Status)
    let subHeader = ["", "STATUS ->"];
    allDates.forEach(() => subHeader.push("PRESENT / ABSENT / HOLIDAY"));
    const subHeaderRow = worksheet.addRow(subHeader);
    subHeaderRow.font = { italic: true, size: 9, color: { argb: 'FF555555' } };

    // 3. DATA PROCESSING
    students.forEach(student => {
      let pCount = 0, aCount = 0, hCount = 0;
      let rowData = [student.srNo, student.name];

      allDates.forEach(date => {
        const dailyRecord = attendanceRecords.find(r => r.date === date);
        const studentStatus = dailyRecord?.attendanceData.find(at => 
          at.studentId?.toString() === student._id.toString()
        );
        
        if (dailyRecord?.isHoliday) {
          rowData.push("HOLIDAY");
          hCount++;
        } else if (studentStatus) {
          const s = studentStatus.status.toUpperCase(); // "PRESENT" or "ABSENT"
          rowData.push(s);
          if (s === "PRESENT") pCount++; 
          else if (s === "ABSENT") aCount++;
        } else {
          rowData.push("-"); 
        }
      });

      const totalActive = pCount + aCount;
      const percentage = totalActive > 0 
        ? `${((pCount / totalActive) * 100).toFixed(2)}%` 
        : "0%";
      
      rowData.push(hCount, pCount, aCount, percentage);
      worksheet.addRow(rowData);
    });

    // 4. COLUMN WIDTH & STYLING
    worksheet.columns.forEach((col, index) => {
      if (index === 1) col.width = 30; // Name column
      else if (index > 1 && index < (allDates.length + 2)) col.width = 20; // Date columns (wider for full words)
      else col.width = 18; // Totals columns
    });

    // Final response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Attendance_Report.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).send("Export Error: " + err.message);
  }
});

module.exports = router;
