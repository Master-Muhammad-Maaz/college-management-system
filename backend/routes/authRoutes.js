const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const File = require("../models/File");
const multer = require("multer");
const path = require("path");

// --- AUTHENTICATION ROUTES ---

router.post("/register", async (req, res) => {
  try {
    const { name, contact, dob, role } = req.body;

    // Validation: Check if fields are missing
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
      // Check if student already exists
      const existingStudent = await Student.findOne({ contact });
      if (existingStudent) return res.json({ success: false, message: "Student already exists" });
      
      const newStudent = new Student({ name, contact, dob });
      await newStudent.save();
      return res.json({ success: true, message: "Student registration successful" });
    }

    return res.status(400).json({ success: false, message: "Invalid role" });

  } catch (err) {
    // FIX: Detailed logging for Vercel/Atlas debugging
    console.error("Registration Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration", 
      error: err.message 
    });
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
      // Dashboard sync ke liye user object bhejna zaroori hai
      return res.json({ success: true, message: "Student Login Successful", user: student });
    }
    
    return res.json({ success: false, message: "Invalid role" });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// --- FOLDER MANAGEMENT ROUTES ---

router.post("/create-folder", async (req, res) => {
  try {
    const { name, parentId } = req.body; 
    
    if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

    const newFolder = new Folder({ 
      name, 
      parentId: (!parentId || parentId === "root" || parentId === "") ? null : parentId 
    });
    
    await newFolder.save();
    res.json({ success: true, message: "Folder created successfully", folder: { ...newFolder._doc, type: 'folder' } });
  } catch (err) {
    console.error("Folder Error:", err.message);
    res.status(500).json({ success: false, message: "Server error creating folder" });
  }
});

router.get("/folders/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    const query = (parentId === "root" || parent
