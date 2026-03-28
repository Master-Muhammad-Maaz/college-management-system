const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');

// 1. Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// 2. POST: Add New Assignment (Ab folderId ke saath)
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        // Body se folderId bhi nikaal rahe hain
        const { fileName, teacherName, course, semester, type, content, deadline, folderId } = req.body;

        const newAssignment = new Assignment({
            fileName,
            teacherName,
            course,
            semester,
            type,
            deadline,
            folderId, // 🚀 Batch connect karne ke liye
            content: type === 'text' ? content : undefined,
            fileUrl: type === 'file' ? req.file.filename : undefined,
            isLatest: true
        });

        await newAssignment.save();
        res.status(200).json({ success: true, message: "Assignment Published!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. 🚀 NEW: Specific Folder ke Assignments fetch karne ke liye
// Isse Student Dashboard batch-wise data dikhayega
router.get('/folder/:folderId', async (req, res) => {
    try {
        const assignments = await Assignment.find({ folderId: req.params.folderId })
                                           .sort({ uploadedAt: -1 });
        res.json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. GET: Latest Assignment for Student Dashboard Alert
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
