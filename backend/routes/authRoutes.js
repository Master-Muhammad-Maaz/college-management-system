const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const File = require("../models/File");

// --- 1. AUTHENTICATION ROUTES ---

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, contact, dob, role } = req.body;

    if (!name || !contact || !dob || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

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

    return res.status(400).json({ success: false, message: "Invalid role" });

  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// Login Route
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
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- 2. FOLDER MANAGEMENT ROUTES ---

// Create Folder
router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body; 
    if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

    const newFolder = new Folder({ 
      name, 
      parentId: (!parentId || parentId === "root") ? null : parentId 
    });
    
    await newFolder.save();
    res.json({ success: true, message: "Folder created successfully", folder: newFolder });
  } catch (err) {
    console.error("Folder Create Error:", err.message);
    res.status(500).json({ success: false, message: "Server error creating folder" });
  }
});

// Get Folders & Files
router.get("/folders/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    const query = (parentId === "root") ? { parentId: null } : { parentId };

    const folders = await Folder.find(query);
    const files = await File.find(query);

    res.json({ 
      success: true, 
      folders: folders.map(f => ({ ...f._doc, type: 'folder' })),
      files: files.map(f => ({ ...f._doc, type: 'file' }))
    });
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching contents" });
  }
});

// --- VERY IMPORTANT: EXPORT THE ROUTER ---
module.exports = router;
