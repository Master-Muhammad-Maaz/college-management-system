const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');

// 1. Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ye folder 'backend/' ke andar hona chahiye
    },
    filename: (req, file, cb) => {
        // Unique filename banane ke liye: assignment-12345.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// 2. POST: Add New Assignment (File ya Text dono ke liye)
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { fileName, teacherName, course, semester, type, content, deadline } = req.body;

        const newAssignment = new Assignment({
            fileName,
            teacherName,
            course,
            semester,
            type,
            deadline,
            content: type === 'text' ? content : undefined,
            filePath: type === 'file' ? req.file.filename : undefined,
            isLatest: true
        });

        await newAssignment.save();
        res.status(200).json({ success: true, message: "Assignment Published!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. GET: Latest Assignment for Student Dashboard Alert
router.get('/latest', async (req, res) => {
    try {
        const latest = await Assignment.findOne().sort({ createdAt: -1 });
        if (!latest) return res.status(404).json({ success: false });
        
        res.json({ success: true, assignment: latest });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
