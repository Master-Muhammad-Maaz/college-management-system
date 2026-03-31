const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const File = require("../models/File");

// 1. REGISTER (Updated: Course and Password are now optional)
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password } = req.body;

        // Basic check for all roles
        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (role === "student") {
            const existingStudent = await Student.findOne({ mobile: contact });
            if (existingStudent) return res.json({ success: false, message: "Student already exists" });

            // Naya student create karein, agar course/password nahi hai toh default use hoga
            const newStudent = new Student({
                name,
                mobile: contact, 
                dob,
                password: password || "123456", // Default password
                course: course || null // Course ab optional hai
            });

            await newStudent.save();
            return res.json({ success: true, message: "Student Registered Successfully" });
        } 
        
        if (role === "admin") {
            const existingAdmin = await Admin.findOne({ contact });
            if (existingAdmin) return res.json({ success: false, message: "Admin already exists" });

            const newAdmin = new Admin({ name, contact, dob });
            await newAdmin.save();
            return res.json({ success: true, message: "Admin Registered Successfully" });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;
        
        if (role === "student") {
            const user = await Student.findOne({ mobile: contact, dob });
            if (!user) return res.json({ success: false, message: "Invalid Student Credentials" });
            return res.json({ success: true, message: "Login Successful", user });
        } else {
            const user = await Admin.findOne({ contact, dob });
            if (!user) return res.json({ success: false, message: "Invalid Admin Credentials" });
            return res.json({ success: true, message: "Login Successful", user });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 3. FOLDERS & FILES
router.post("/create-folder", async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const newFolder = new Folder({ name, parentId: parentId === "root" ? null : parentId });
        await newFolder.save();
        res.json({ success: true, folder: newFolder });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating folder" });
    }
});

router.get("/folders/:parentId", async (req, res) => {
    try {
        const { parentId } = req.params;
        const query = parentId === "root" ? { parentId: null } : { parentId };
        const folders = await Folder.find(query);
        const files = await File.find(query);
        res.json({ success: true, folders, files });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching" });
    }
});

module.exports = router;
