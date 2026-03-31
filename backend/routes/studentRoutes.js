const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");

// Multer storage setup (Render writable folder)
const upload = multer({ dest: "uploads/" });

// 1. ADD SINGLE STUDENT
router.post("/add", async (req, res) => {
  try {
    const { srNo, name, course, mobile, dob } = req.body;
    if (!srNo || !name || !course) {
      return res.status(400).json({ success: false, message: "Sr No, Name and Course are required." });
    }

    const existing = await StudentRecord.findOne({ srNo, course });
    if (existing) {
      return res.status(400).json({ success: false, message: "Roll No already exists in this course." });
    }

    const newStudent = new StudentRecord({ srNo, name, course, mobile, dob });
    await newStudent.save();
    res.json({ success: true, message: "Student added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. CLEAR BATCH (PIN: 1234)
router.post("/clear-batch", async (req, res) => {
  try {
    const { course, pincode } = req.body;
    if (pincode !== "1234") return res.status(401).json({ success: false, message: "Invalid PIN!" });
    
    const result = await StudentRecord.deleteMany({ course });
    res.json({ success: true, message: `Cleared ${result.deletedCount} students from ${course}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Clear failed: " + err.message });
  }
});

// 3. BULK IMPORT (EXCEL) - FIXED LOGIC
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
    const { fallbackCourse } = req.body; 
    if (!req.file) return res.status(400).json({ success: false, message: "File not found." });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    const studentsData = [];
    let headerMap = { srNo: 1, name: 2, course: 3, mobile: 4, dob: 5 }; // Default columns

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Dynamic Header Detection
        row.eachCell((cell, colNumber) => {
          const header = cell.value?.toString().toLowerCase().trim() || "";
          if (header.includes("sr") || header.includes("roll")) headerMap.srNo = colNumber;
          if (header.includes("name")) headerMap.name = colNumber;
          if (header.includes("course") || header.includes("class")) headerMap.course = colNumber;
          if (header.includes("mobile") || header.includes("contact")) headerMap.mobile = colNumber;
          if (header.includes("dob") || header.includes("birth")) headerMap.dob = colNumber;
        });
      } else {
        const srNoRaw = row.getCell(headerMap.srNo).value;
        const nameRaw = row.getCell(headerMap.name).value;
        
        if (srNoRaw && nameRaw) {
          // Date formatting handle karna zaroori hai
          let dobValue = row.getCell(headerMap.dob).value;
          if (dobValue instanceof Date) {
            dobValue = dobValue.toISOString().split('T')[0];
          }

          studentsData.push({
            srNo: parseInt(srNoRaw),
            name: nameRaw.toString().trim(),
            course: row.getCell(headerMap.course).value?.toString().trim() || fallbackCourse || "General",
            mobile: row.getCell(headerMap.mobile).value?.toString() || "N/A",
            dob: dobValue?.toString() || "N/A"
          });
        }
      }
    });

    // Bulk Upsert Operations
    const operations = studentsData.map(data => ({
      updateOne: {
        filter: { srNo: data.srNo, course: data.course },
        update: { $set: data },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await StudentRecord.bulkWrite(operations);
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `Successfully imported/updated ${studentsData.length} students.` });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Import Error: " + error.message });
  }
});

// 4. LIST API
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const filter = course ? { course: new RegExp(course, 'i') } : {};
    const students = await StudentRecord.find(filter).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Load failed." });
  }
});

module.exports = router;
