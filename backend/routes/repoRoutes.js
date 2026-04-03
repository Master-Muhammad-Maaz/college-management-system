const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Folder = require("../models/Folder");
const File = require("../models/File");

// Multer Configuration
const storage = multer.diskStorage({
  destination: "uploads/repository/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// --- 1. CREATE FOLDER ---
router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const newFolder = new Folder({ 
      name, 
      parentId: parentId === "root" || !parentId ? null : parentId 
    });
    await newFolder.save();
    res.json({ success: true, folder: newFolder });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// --- 2. GET FOLDERS ---
router.get("/folders/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId === "root" ? null : req.params.parentId;
    const folders = await Folder.find({ parentId });
    res.json({ success: true, folders });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// --- 3. GET FILES ---
router.get("/files/:folderId", async (req, res) => {
  try {
    const folderId = req.params.folderId === "root" ? null : req.params.folderId;
    const files = await File.find({ folderId });
    res.json({ success: true, files });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// --- 4. UPLOAD FILE ---
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const newFile = new File({
      name: req.file.originalname,
      path: `/uploads/repository/${req.file.filename}`, // Saved with leading slash for frontend
      folderId: req.body.folderId === "root" || !req.body.folderId ? null : req.body.folderId
    });
    await newFile.save();
    res.json({ success: true, file: newFile });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// --- 5. DELETE FOLDER (Recursive Clean-up) ---
router.delete("/delete-folder/:id", async (req, res) => {
  try {
    const folderId = req.params.id;

    // A. Check for sub-folders first to prevent messy database
    const subFolders = await Folder.find({ parentId: folderId });
    if (subFolders.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete. This folder contains sub-folders. Delete them first." 
      });
    }

    // B. Find all files in this folder to delete from physical storage
    const filesInFolder = await File.find({ folderId });
    
    filesInFolder.forEach(file => {
      // Fix path: remove leading slash and resolve from project root
      const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      const absolutePath = path.resolve(cleanPath); 
      
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    });

    // C. Remove from Database
    await File.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);

    res.json({ success: true, message: "Folder and internal files deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 6. DELETE SINGLE FILE ---
router.delete("/delete-file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    // Resolve path for physical deletion
    const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
    const absolutePath = path.resolve(cleanPath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
