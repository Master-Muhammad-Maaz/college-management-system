const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");

const upload = multer({ dest: "uploads/" });

// --- BULK IMPORT (EXCEL) - FULLY SYNCED ---
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
    // Frontend se current active tab ka course lein
    const { fallbackCourse } = req.body; 
    if (!req.file) return res.status(400).json({ success: false, message: "Excel file not found." });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    const studentsData = [];
    let headerMap = {};

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          const header = cell.value?.toString().toLowerCase().trim();
          if (header.includes("sr")) headerMap.srNo = colNumber;
          if (header.includes("name")) headerMap.name = colNumber;
          if (header.includes("course") || header.includes("class")) headerMap.course = colNumber;
          if (header.includes("mobile") || header.includes("contact")) headerMap.mobile = colNumber;
          if (header.includes("dob") || header.includes("birth")) headerMap.dob = colNumber;
        });
      } else {
        const srNo = row.getCell(headerMap.srNo || 1).value;
        const name = row.getCell(headerMap.name || 2).value?.toString().trim();
        const mobile = row.getCell(headerMap.mobile || 3).value?.toString().trim();
        const dob = row.getCell(headerMap.dob || 4).value?.toString().trim();
        
        // Priority: 1. Excel Course Column | 2. Frontend Selected Tab
        let course = row.getCell(headerMap.course).value?.toString().trim() || fallbackCourse;

        if (srNo && name && course) {
          studentsData.push({
            srNo: parseInt(srNo),
            name,
            mobile: mobile || "N/A",
            dob: dob || "N/A",
            course: course
          });
        }
      }
    });

    // Save with unique check (SR No + Course)
    for (const data of studentsData) {
      await StudentRecord.findOneAndUpdate(
        { srNo: data.srNo, course: data.course },
        data,
        { upsert: true, new: true }
      );
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `Imported ${studentsData.length} students to ${fallbackCourse || 'respective courses'}.` });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Import failed: " + error.message });
  }
});

// --- LIST API (Filtered by Course) ---
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query; // Admin panel tabs handle this
    const students = await StudentRecord.find(course ? { course } : {}).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) { 
    res.status(500).json({ success: false, message: "Unable to load student list." }); 
  }
});

// ... rest of the routes (add, clear-batch) same as before
module.exports = router;
