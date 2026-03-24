const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");

const upload = multer({ dest: "uploads/" });

// --- A. ADD SINGLE STUDENT (New Route for Modal) ---
router.post("/add", async (req, res) => {
  try {
    const { srNo, name, dob, mobile, course } = req.body;

    // Validation
    if (!srNo || !name || !dob || !mobile || !course) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newStudent = new StudentRecord({
      srNo: parseInt(srNo),
      name,
      dob,
      mobile,
      course
    });

    await newStudent.save();
    res.json({ success: true, message: "Student added successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "SR No already exists in this course!" });
    }
    res.status(500).json({ success: false, message: "Database Error: " + err.message });
  }
});

// --- B. CLEAR ENTIRE BATCH (Pincode Protected) ---
router.post("/clear-batch", async (req, res) => {
  try {
    const { course, pincode } = req.body;
    const SECRET_PIN = "1234"; 

    if (pincode !== SECRET_PIN) {
      return res.status(403).json({ success: false, message: "Invalid Pincode!" });
    }

    const result = await StudentRecord.deleteMany({ course });
    res.json({ 
      success: true, 
      message: `Batch ${course} cleared (${result.deletedCount} records).` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error: Unable to clear batch." });
  }
});

// --- C. MANUAL SYNC ROUTE ---
router.post("/sync-students", async (req, res) => {
  try {
    const { studentsList, course } = req.body;
    if (!studentsList || studentsList.length === 0) {
      return res.status(400).json({ success: false, message: "No student data provided." });
    }

    const operations = studentsList.map(student => ({
      updateOne: {
        filter: { srNo: parseInt(student.srNo), course: course },
        // Updated to include mobile and dob
        update: { 
          $set: { 
            name: student.name, 
            mobile: student.mobile, 
            dob: student.dob, 
            course: course 
          } 
        },
        upsert: true
      }
    }));

    await StudentRecord.bulkWrite(operations);
    res.json({ success: true, message: "Student records synchronized!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sync Error: Database update failed." });
  }
});

// --- D. BULK IMPORT (EXCEL) ---
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
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
          if (header.includes("course")) headerMap.course = colNumber;
          if (header.includes("mobile") || header.includes("contact")) headerMap.mobile = colNumber;
          if (header.includes("dob") || header.includes("birth")) headerMap.dob = colNumber;
        });
      } else {
        const srNo = row.getCell(headerMap.srNo || 1).value;
        const name = row.getCell(headerMap.name || 2).value?.toString().trim();
        const mobile = row.getCell(headerMap.mobile || 3).value?.toString().trim();
        const dob = row.getCell(headerMap.dob || 4).value?.toString().trim();
        const course = row.getCell(headerMap.course || 5).value?.toString().trim();

        if (srNo && name && mobile && dob && course) {
          studentsData.push({
            srNo: parseInt(srNo),
            name,
            mobile,
            dob,
            course
          });
        }
      }
    });

    for (const data of studentsData) {
      await StudentRecord.findOneAndUpdate(
        { srNo: data.srNo, course: data.course },
        data,
        { upsert: true, new: true }
      );
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `Import complete: ${studentsData.length} records processed.` });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Import Error: File processing failed." });
  }
});

// --- E. LIST API ---
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const students = await StudentRecord.find(course ? { course } : {}).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) { 
    res.status(500).json({ success: false, message: "Fetch Error: Unable to load student list." }); 
  }
});

module.exports = router;
