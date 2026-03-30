const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const Folder = require('../models/Folder');

// 1. Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

// --- 🚀 FIX 1: DRIVE CONTENT ROUTE (Frontend isi ko call kar raha hai) ---
router.get('/content/:course/:folderId', async (req, res) => {
    try {
        const { course, folderId } = req.params;
        
        // Agar folderId "root" hai, toh parentId: null search karein
        const queryParentId = folderId === "root" ? null : folderId;

        const folders = await Folder.find({ course, parentId: queryParentId }).sort({ createdAt: -1 });
        const files = await Assignment.find({ course, folderId: queryParentId }).sort({ createdAt: -1 });

        res.json({ success: true, folders, files });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 🚀 FIX 2: CREATE FOLDER WITH PARENT ID ---
router.post('/create-folder', async (req, res) => {
    try {
        const { name, course, parentId } = req.body; // parentId yahan se aayega
        if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

        const newFolder = new Folder({ 
            name, 
            course,
            parentId: parentId || null // Google Drive Logic
        });

        await newFolder.save();
        res.status(200).json({ success: true, message: "Folder Created!", folder: newFolder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 🚀 FIX 3: ASSIGNMENT UPLOAD ---
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { fileName, teacherName, course, semester, type, content, deadline, folderId } = req.body;
        
        const newAssignment = new Assignment({
            fileName, 
            teacherName, 
            course, 
            semester, 
            type, 
            deadline, 
            folderId: folderId || null, // Kis folder mein save karna hai
            content: type === 'text' ? content : undefined,
            fileUrl: type === 'file' ? req.file.filename : undefined,
            isLatest: true
        });

        await newAssignment.save();
        res.status(200).json({ success: true, message: "File Uploaded!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Purane routes (compatibility ke liye):
router.get('/folders/:course', async (req, res) => {
    try {
        const folders = await Folder.find({ course: req.params.course, parentId: null });
        res.json({ success: true, folders });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
