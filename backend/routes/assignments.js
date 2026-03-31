const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Assignment = require('../models/Assignment');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 🚀 1. GET CONTENT (Root aur Nested dono handle karega)
router.get('/content/:course/:folderId', async (req, res) => {
    try {
        const { course, folderId } = req.params;
        
        // Logic: Agar frontend se "root" ya "null" string aaye, toh use null (top-level) treat karein
        const queryParentId = (folderId === "root" || folderId === "null" || !folderId || folderId === "undefined") ? null : folderId;

        const folders = await Folder.find({ course, parentId: queryParentId }).sort({ createdAt: -1 });
        const files = await Assignment.find({ course, folderId: queryParentId }).sort({ createdAt: -1 });

        res.json({ success: true, folders, files });
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🚀 2. CREATE FOLDER
router.post('/create-folder', async (req, res) => {
    try {
        const { name, course, parentId } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

        const newFolder = new Folder({ 
            name, 
            course, 
            parentId: (parentId === "root" || !parentId) ? null : parentId 
        });

        await newFolder.save();
        res.status(200).json({ success: true, folder: newFolder });
    } catch (err) {
        console.error("Create Folder Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🚀 3. FILE UPLOAD
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { fileName, teacherName, course, folderId } = req.body;
        
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const newFile = new Assignment({
            fileName: fileName || req.file.originalname, 
            teacherName, 
            course,
            folderId: (folderId === "root" || !folderId) ? null : folderId,
            fileUrl: req.file.filename,
            type: 'file'
        });

        await newFile.save();
        res.json({ success: true, message: "File uploaded successfully" });
    } catch (err) { 
        console.error("Upload Error:", err.message);
        res.status(500).json({ success: false, error: err.message }); 
    }
});

// IMPORTANT: Exports router to prevent SyntaxError in server.js
module.exports = router;
