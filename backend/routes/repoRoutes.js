const express = require("express");
const router = express.Router();
const multer = require("multer");
const Folder = require("../models/Folder");
const File = require("../models/File");

const storage = multer.diskStorage({
  destination: "uploads/repository/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 1. Create Folder (Added Course)
router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId, course } = req.body;
    const newFolder = new Folder({ 
      name, 
      parentId: parentId === "root" ? null : parentId,
      course: course || "General"
    });
    await newFolder.save();
    res.json({ success: true, folder: newFolder });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// 2. Get Folders with Course Filter
router.get("/folders/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId === "root" ? null : req.params.parentId;
    const { course } = req.query;
    let query = { parentId };
    if (course) query.course = course; // Filter by student course
    
    const folders = await Folder.find(query);
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

// 3. Upload File
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

// 4. Delete Logic
router.delete("/delete-folder/:id", async (req, res) => {
  await Folder.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.delete("/delete-file/:id", async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
