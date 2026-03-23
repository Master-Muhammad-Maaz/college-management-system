const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");

const upload = multer({ dest: "uploads/" });

// A. NEW: Clear Entire Batch Route (Pincode Protected)
router.post("/clear-batch", async (req, res) => {
  try {
    const { course, pincode } = req.body;
    const SECRET_PIN = "1234"; 

    if (pincode !== SECRET_PIN) {
      return res.status(403).json({ success: false, message: "Invalid Pincode! Access denied." });
    }

    const result = await StudentRecord.deleteMany({ course });
    
    res.json({ 
      success: true, 
      message: `Batch ${course} has been cleared (${result.deletedCount} records). System ready for new session.` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error: Unable to clear batch data." });
  }
});

// B. Manual Sync Route
router.post("/sync-students", async (req, res) => {
  try {
    const { studentsList, course } = req.body;
    if (!studentsList || studentsList.length === 0) {
      return res.status(400).json({ success: false, message: "Sync failed: No student data provided." });
    }
    const operations = studentsList.map(student => ({
      updateOne: {
        filter: { srNo: parseInt(student.srNo), course: course },
        update: { $set: { name: student.name, course: course } },
        upsert: true
      }
    }));
    await StudentRecord.bulkWrite(operations);
    res.json({ success: true, message: "Student records synchronized successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sync Error: Database update failed." });
  }
});

// C. Bulk Import
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Import failed: Excel file not found." });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    const studentsData = [];
    let headerMap = {};

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          const header = cell.value?.toString().toLowerCase().trim().replace(/[^a-z]/g, "");
          if (header.includes("sr")) headerMap.srNo = colNumber;
          if (header.includes("name")) headerMap.name = colNumber;
          if (header.includes("course")) headerMap.course = colNumber;
        });
      } else {
        const srNo = row.getCell(headerMap.srNo || 1).value;
        const course = row.getCell(headerMap.course || 5).value?.toString().trim();
        if (srNo && course) {
          studentsData.push({
            srNo: parseInt(srNo),
            name: row.getCell(headerMap.name || 2).value?.toString().trim() || "Unknown",
            course: course
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

// D. List API
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const students = await StudentRecord.find(course ? { course } : {}).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) { res.status(500).json({ success: false, message: "Fetch Error: Unable to load student list." }); }
});

module.exports = router;