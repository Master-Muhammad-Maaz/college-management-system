const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const Folder = require('../models/Folder'); // Folder model import kiya

// 1. Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// --- 🚀 NEW: Create Folder Route (Ye missing tha) ---
router.post('/create-folder', async (req, res) => {
    try {
        const { name, course } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

        const newFolder = new Folder({ 
            name, 
            course // Schema mein course add kiya taaki batch-wise dikhe
        });

        await newFolder.save();
        res.status(200).json({ success: true, message: "Folder Created!", folder: newFolder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 🚀 NEW: Fetch Folders Route ---
router.get('/folders/:course', async (req, res) => {
    try {
        const folders = await Folder.find({ course: req.params.course }).sort({ createdAt: -1 });
        res.json({ success: true, folders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Add New Assignment
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { fileName, teacherName, course, semester, type, content, deadline, folderId } = req.body;
        const newAssignment = new Assignment({
            fileName, teacherName, course, semester, type, deadline, folderId,
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

// 3. Fetch Assignments by Folder
router.get('/folder/:folderId', async (req, res) => {
    try {
        const assignments = await Assignment.find({ folderId: req.params.folderId }).sort({ uploadedAt: -1 });
        res.json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
