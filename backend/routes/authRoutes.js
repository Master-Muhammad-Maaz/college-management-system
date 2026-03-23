const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");

// --- AUTHENTICATION ROUTES ---

router.post("/register", async (req, res) => {
  try {
    const { name, contact, dob, role } = req.body;
    if (role === "admin") {
      const existingAdmin = await Admin.findOne({ contact });
      if (existingAdmin) return res.json({ success: false, message: "Admin already exists" });
      const newAdmin = new Admin({ name, contact, dob });
      await newAdmin.save();
      return res.json({ success: true, message: "Admin registration successful" });
    }
    if (role === "student") {
      const existingStudent = await Student.findOne({ contact });
      if (existingStudent) return res.json({ success: false, message: "Student already exists" });
      const newStudent = new Student({ name, contact, dob });
      await newStudent.save();
      return res.json({ success: true, message: "Student registration successful" });
    }
    return res.json({ success: false, message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { contact, dob, role } = req.body;
    if (role === "admin") {
      const admin = await Admin.findOne({ contact, dob });
      if (!admin) return res.json({ success: false, message: "Invalid Admin Credentials" });
      return res.json({ success: true, message: "Admin Login Successful", user: admin });
    }
    if (role === "student") {
      const student = await Student.findOne({ contact, dob });
      if (!student) return res.json({ success: false, message: "Invalid Student Credentials" });
      return res.json({ success: true, message: "Student Login Successful", user: student });
    }
    return res.json({ success: false, message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- FOLDER MANAGEMENT ROUTES ---

// 1. Create Folder (Sub-folder support ke sath)
router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body; 
    // Agar parentId frontend se aayi hai toh wo subfolder banega, warna root folder
    const newFolder = new Folder({ 
      name, 
      parentId: parentId && parentId !== "root" ? parentId : null 
    });
    await newFolder.save();
    res.json({ success: true, message: "Folder created successfully", folder: newFolder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. Get Folders by Parent ID
router.get("/folders/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    // Agar parentId 'root' hai toh sirf wo folders lao jinka parentId null hai
    const query = parentId === "root" ? { parentId: null } : { parentId };
    const folders = await Folder.find(query);
    res.json({ success: true, folders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 3. Delete Folder
router.delete("/delete-folder/:id", async (req, res) => {
  try {
    await Folder.findByIdAndDelete(req.params.id);
    // Note: Future mein yahan nested sub-folders delete karne ka recursive logic add karenge
    res.json({ success: true, message: "Folder deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting folder" });
  }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 1. Upload File Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { folderId } = req.body;
    const newFile = new File({
      name: req.file.originalname,
      path: req.file.path,
      folderId: folderId === "root" ? null : folderId
    });
    await newFile.save();
    res.json({ success: true, message: "File uploaded successfully", file: newFile });
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// 2. Get Files by Folder ID
router.get("/files/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;
    const query = folderId === "root" ? { folderId: null } : { folderId };
    const files = await File.find(query);
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching files" });
  }
});

// 3. Delete File Route
router.delete("/delete-file/:id", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

module.exports = router;