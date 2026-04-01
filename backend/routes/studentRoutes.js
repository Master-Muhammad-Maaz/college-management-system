const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");
const fs = require("fs");
const StudentRecord = require("../models/StudentRecord");
const Attendance = require("../models/Attendance");

const upload = multer({ dest: "uploads/" });

// 1. ADD SINGLE STUDENT
router.post("/add", async (req, res) => {
  try {
    const { srNo, name, course, mobile, dob } = req.body;
    const existing = await StudentRecord.findOne({ srNo, course });
    if (existing) return res.status(400).json({ success: false, message: "Roll No exists." });

    const newStudent = new StudentRecord({ srNo, name, course, mobile, dob });
    await newStudent.save();
    res.json({ success: true, message: "Added!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POWERFUL CLEAR BATCH
router.post("/clear-batch-full", async (req, res) => {
  try {
    const { course, pincode } = req.body;
    if (pincode !== "1234") return res.status(401).json({ success: false, message: "Invalid PIN!" });

    await StudentRecord.deleteMany({ course });
    await Attendance.deleteMany({ course });

    res.json({ success: true, message: `Batch ${course} completely wiped out!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. BULK IMPORT
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    const { course } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    const studentsData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const srNoVal = row.getCell(1).value;
        const nameVal = row.getCell(2).value;

        if (srNoVal && nameVal) {
          studentsData.push({
            srNo: parseInt(srNoVal.toString()),
            name: nameVal.toString().toUpperCase(),
            course: course,
            mobile: row.getCell(4).value?.toString() || "N/A",
            dob: row.getCell(5).value?.toString() || "N/A"
          });
        }
      }
    });

    if (studentsData.length === 0) throw new Error("No valid data found in Excel sheet.");

    const ops = studentsData.map(d => ({
      updateOne: {
        filter: { srNo: d.srNo, course: d.course },
        update: { $set: d },
        upsert: true
      }
    }));

    await StudentRecord.bulkWrite(ops);
    fs.unlinkSync(req.file.path);

    res.json({ success: true, message: "Imported Successfully!", count: studentsData.length });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. LIST API
router.get("/list", async (req, res) => {
  try {
    const { course } = req.query;
    const students = await StudentRecord.find({ course: new RegExp(course, 'i') }).sort({ srNo: 1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Load failed" });
  }
});

// 5. FINALIZED EXCEL EXPORT (Matches your p/a/h requirement)
router.get("/export", async (req, res) => {
  try {
    const { course } = req.query;
    
    const students = await StudentRecord.find({ course }).sort({ srNo: 1 });
    const attendanceRecords = await Attendance.find({ course });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course} Attendance`);

    // Unique Dates header ke liye
    const uniqueDates = [...new Set(attendanceRecords.map(rec => rec.date))].sort();

    // Headers set karein
    const headers = ["sr.no", "student name", ...uniqueDates, "total holiday's", "total present days", "total apsent days", "average percentgae"];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    // Data rows
    students.forEach((student) => {
      let present = 0, absent = 0, holiday = 0;
      const rowData = [student.srNo, student.name];

      uniqueDates.forEach((date) => {
        const record = attendanceRecords.find(r => r.date === date);
        const studentStatus = record?.attendanceData.find(a => a.studentId.toString() === student._id.toString());
        
        let status = "-"; 
        if (record?.isHoliday) {
          status = "h";
          holiday++;
        } else if (studentStatus) {
          status = studentStatus.status === "Present" ? "p" : "a";
          if (status === "p") present++; else absent++;
        }
        rowData.push(status);
      });

      const totalActiveDays = present + absent;
      const percentage = totalActiveDays > 0 ? ((present / totalActiveDays) * 100).toFixed(2) + "%" : "0%";

      rowData.push(holiday, present, absent, percentage);
      worksheet.addRow(rowData);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${course}_Attendance.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).send("Export failed: " + err.message);
  }
});

module.exports = router;
