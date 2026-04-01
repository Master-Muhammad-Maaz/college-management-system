const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const StudentRecord = require("../models/StudentRecord");
const ExcelJS = require("exceljs");

// 1. SWIPE-SESSION: Poore batch ki attendance save/update karne ke liye
router.post("/swipe-session", async (req, res) => {
  try {
    const { date, course, attendanceData } = req.body; 
    
    // Check karein ke zaroori data mil raha hai ya nahi
    if (!date || !course || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ success: false, message: "Date, Course aur Attendance Data missing hai!" });
    }

    const update = {
      date,
      course,
      isHoliday: false,
      attendanceData: attendanceData.map(item => ({
        studentId: item.studentId,
        status: item.status.toUpperCase() // Hamesha PRESENT/ABSENT/HOLIDAY save hoga
      }))
    };

    // Date aur Course ke combination par unique record update ya create (upsert) hoga
    await Attendance.findOneAndUpdate({ date, course }, update, { upsert: true, new: true });
    
    res.json({ success: true, message: "Attendance successfully update ho gayi!" });
  } catch (err) { 
    console.error("Database Error:", err.message);
    res.status(500).json({ success: false, message: "Database Error: " + err.message }); 
  }
});

// 2. SMART EXCEL EXPORT: Dynamic Dates aur P/A status ke saath
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query; 
    if (!course) return res.status(400).send("Course specify karein.");

    // Database se Students aur Attendance Records fetch karein
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course }).sort({ date: 1 });
    
    // Saari unique dates nikaalein jo Excel columns banengi
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].filter(Boolean).sort();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Report`);

    // --- HEADERS SETUP ---
    let headers = ["SR. NO", "STUDENT NAME", ...allDates, "TOTAL HOLIDAYS", "TOTAL PRESENT", "TOTAL ABSENT", "PERCENTAGE"];
    const headerRow = worksheet.addRow(headers);
    
    // Header Styling (Professional Look)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

    // --- DATA ROWS ---
    students.forEach(student => {
      let pCount = 0, aCount = 0, hCount = 0;
      let rowData = [student.srNo, student.name];

      // Har dynamic date ke liye student ka status check karein
      allDates.forEach(date => {
        const dayRecord = attendanceRecords.find(r => r.date === date);
        const sStatus = dayRecord?.attendanceData.find(at => 
          at.studentId?.toString() === student._id.toString()
        );
        
        if (dayRecord?.isHoliday) {
          rowData.push("H"); 
          hCount++;
        } else if (sStatus) {
          const status = sStatus.status.toUpperCase();
          if (status === "PRESENT") {
            rowData.push("P");
            pCount++;
          } else if (status === "ABSENT") {
            rowData.push("A");
            aCount++;
          } else {
            rowData.push("-");
          }
        } else {
          rowData.push("-"); 
        }
      });

      // Percentage Calculation
      const totalDays = pCount + aCount;
      const perc = totalDays > 0 ? `${((pCount / totalDays) * 100).toFixed(2)}%` : "0%";
      
      rowData.push(hCount, pCount, aCount, perc);
      const dataRow = worksheet.addRow(rowData);
      dataRow.alignment = { horizontal: 'center' };
    });

    // Column Width Adjustments
    worksheet.columns.forEach((col, index) => {
      if (index === 1) col.width = 30; // Student Name
      else col.width = 15; // Dates aur Totals
    });

    // Download Headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Attendance_Report.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) { 
    console.error("Export Error:", err.message);
    res.status(500).send("Excel export fail ho gaya: " + err.message); 
  }
});

module.exports = router;
