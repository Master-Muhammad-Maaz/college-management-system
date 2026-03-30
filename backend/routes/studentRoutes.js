const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");

const upload = multer({ dest: "uploads/" });

// 1. ADD SINGLE STUDENT (Fixes "Add Student" Error)
router.post("/add", async (req, res) => {
  try {
    const { srNo, name, course, mobile, dob } = req.body;
    if (!srNo || !name || !course) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
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

// 2. CLEAR BATCH (Fixes "Clear Batch" Error)
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

// 3. BULK IMPORT (EXCEL)
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
    const { fallbackCourse } = req.body; 
    if (!req.file) return res.status(400).json({ success: false, message: "File not found." });

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
          if (header.includes("mobile")) headerMap.mobile = colNumber;
          if (header.includes("dob")) headerMap.dob = colNumber;
        });
      } else {
        const srNo = row.getCell(headerMap.srNo || 1).value;
        const name = row.getCell(headerMap.name || 2).value?.toString().trim();
        const course = row.getCell(headerMap.course).value?.toString().trim() || fallbackCourse;

        if (srNo && name && course) {
          studentsData.push({
            srNo: parseInt(srNo),
            name,
            course,
            mobile: row.getCell(headerMap.mobile || 3).value?.toString() || "N/A",
            dob: row.getCell(headerMap.dob || 4).value?.toString() || "N/A"
          });
        }
      }
    });

    for (const data of studentsData) {
      await StudentRecord.findOneAndUpdate(
        { srNo: data.srNo, course: data.course },
        data,
        { upsert: true }
      );
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `Imported ${studentsData.length} students.` });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. LIST API
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const students = await StudentRecord.find(course ? { course } : {}).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Load failed." });
  }
});

module.exports = router;
