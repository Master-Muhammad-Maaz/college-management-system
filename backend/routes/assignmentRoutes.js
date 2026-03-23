const express = require("express");
const router = express.Router();
const multer = require("multer");
const Assignment = require("../models/Assignment");

const upload = multer({ dest: "uploads/assignments/" });

router.post("/add", upload.single("file"), async (req, res) => {
  try {
    const { fileName, course, semester, type, content, teacherName, deadline } = req.body;

    const newAssignment = new Assignment({
      fileName,
      course,
      semester,
      type,
      content: type === "text" ? content : null,
      fileUrl: type === "file" ? req.file.path : null,
      teacherName,
      deadline
    });

    await newAssignment.save();
    res.json({ success: true, message: "Assignment published successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student side list ke liye
router.get("/list", async (req, res) => {
  try {
    const { course, semester } = req.query;
    const list = await Assignment.find({ course, semester }).sort({ uploadedAt: -1 });
    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;