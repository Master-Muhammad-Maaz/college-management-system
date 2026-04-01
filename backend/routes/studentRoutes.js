const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs"); 
const StudentRecord = require("../models/StudentRecord");
const Attendance = require("../models/Attendance"); // Import Attendance Model

const upload = multer({ dest: "uploads/" });

// 1. ADD STUDENT
router.post("/add", async (req, res) => {
  try {
    const { srNo, name, course, mobile, dob } = req.body;
    const existing = await StudentRecord.findOne({ srNo, course });
    if (existing) return res.status(400).json({ success: false, message: "Roll No exists." });
    const newStudent = new StudentRecord({ srNo, name, course, mobile, dob });
    await newStudent.save();
    res.json({ success: true, message: "Added!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. POWERFUL CLEAR BATCH (Deletes Students + Attendance)
router.post("/clear-batch-full", async (req, res) => {
  try {
    const { course, pincode } = req.body;
    if (pincode !== "1234") return res.status(401).json({ success: false, message: "Invalid PIN!" });
    
    // Delete from both collections
    await StudentRecord.deleteMany({ course });
    await Attendance.deleteMany({ course });
    
    res.json({ success: true, message: `Batch ${course} completely wiped out!` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 3. BULK IMPORT
router.post("/import-excel", upload.single("file"), async (req, res) => {
  try {
    const { fallbackCourse } = req.body; 
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    const studentsData = [];
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        studentsData.push({
          srNo: parseInt(row.getCell(1).value),
          name: row.getCell(2).value.toString(),
          course: row.getCell(3).value?.toString() || fallbackCourse,
          mobile: row.getCell(4).value?.toString() || "N/A",
          dob: row.getCell(5).value?.toString() || "N/A"
        });
      }
    });

    const ops = studentsData.map(d => ({
      updateOne: { filter: { srNo: d.srNo, course: d.course }, update: { $set: d }, upsert: true }
    }));
    await StudentRecord.bulkWrite(ops);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: "Imported!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 4. LIST API
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const students = await StudentRecord.find({ course: new RegExp(course, 'i') }).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) { res.status(500).json({ success: false, message: "Load failed" }); }
});

module.exports = router;
