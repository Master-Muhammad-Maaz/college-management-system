const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs"); // File system module zaroori hai storage delete ke liye
const path = require("path");
const Folder = require("../models/Folder");
const File = require("../models/File");

const storage = multer.diskStorage({
  destination: "uploads/repository/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// --- CREATE & GET LOGIC (Sahi hai aapka) ---
router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const newFolder = new Folder({ 
      name, 
      parentId: parentId === "root" ? null : parentId 
    });
    await newFolder.save();
    res.json({ success: true, folder: newFolder });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get("/folders/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId === "root" ? null : req.params.parentId;
    const folders = await Folder.find({ parentId });
    res.json({ success: true, folders });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get("/files/:folderId", async (req, res) => {
  try {
    const folderId = req.params.folderId === "root" ? null : req.params.folderId;
    const files = await File.find({ folderId });
    res.json({ success: true, files });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newFile = new File({
      name: req.file.originalname,
      path: `/uploads/repository/${req.file.filename}`,
      folderId: req.body.folderId || null
    });
    await newFile.save();
    res.json({ success: true, file: newFile });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- UPDATED DELETE LOGIC (Fixed) ---

// 1. Delete Folder (And its contents)
router.delete("/delete-folder/:id", async (req, res) => {
  try {
    const folderId = req.params.id;

    // Pehle us folder ki saari files dhoondo aur storage se delete karo
    const filesInFolder = await File.find({ folderId });
    filesInFolder.forEach(file => {
      const filePath = path.join(__dirname, "..", file.path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // File server se delete
    });

    // DB se files aur folder delete karo
    await File.deleteMany({ folderId });
    await Folder.findByIdAndDelete(folderId);

    res.json({ success: true, message: "Folder and contents deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Delete Single File (With Storage Cleanup)
router.delete("/delete-file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    // Server storage se file remove karein
    const filePath = path.join(__dirname, "..", file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Database se record delete karein
    await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
