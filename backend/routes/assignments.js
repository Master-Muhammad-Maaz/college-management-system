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

// 🚀 1. DRIVE CONTENT ROUTER (Root aur Nested dono handle karega)
router.get('/content/:course/:folderId', async (req, res) => {
    try {
        const { course, folderId } = req.params;
        
        // Agar Frontend se "root" aaye, toh null (top-level) search karo
        const queryParentId = (folderId === "root" || folderId === "null" || !folderId) ? null : folderId;

        const folders = await Folder.find({ course, parentId: queryParentId }).sort({ createdAt: -1 });
        const files = await Assignment.find({ course, folderId: queryParentId }).sort({ createdAt: -1 });

        res.json({ success: true, folders, files });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🚀 2. CREATE FOLDER (ParentId support ke saath)
router.post('/create-folder', async (req, res) => {
    try {
        const { name, course, parentId } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Name required" });

        const newFolder = new Folder({ 
            name, 
            course, 
            parentId: parentId || null 
        });

        await newFolder.save();
        res.status(200).json({ success: true, folder: newFolder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🚀 3. FILE UPLOAD
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { fileName, teacherName, course, folderId } = req.body;
        const newFile = new Assignment({
            fileName, teacherName, course,
            folderId: folderId || null,
            fileUrl: req.file.filename,
            type: 'file'
        });
        await newFile.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
