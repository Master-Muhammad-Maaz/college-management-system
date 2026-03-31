const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const File = require("../models/File");

// 1. REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password } = req.body;

        // Basic check for all roles
        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (role === "student") {
            // Student ke liye extra validation jo aapne schema mein rakhi hai
            if (!course || !password) {
                return res.status(400).json({ success: false, message: "Course and Password are required for students" });
            }

            const existingStudent = await Student.findOne({ mobile: contact });
            if (existingStudent) return res.json({ success: false, message: "Student already exists" });

            const newStudent = new Student({
                name,
                mobile: contact, // Schema mein 'mobile' hai, frontend se 'contact' aa raha hai
                dob,
                password,
                course // Must be one of: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
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
        // Agar enum match nahi hua (e.g. B.Sc-1 bhej diya) toh ye error pakdega
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }
});

// 2. LOGIN (Ensure mapping is correct)
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

// 3. FOLDERS & FILES (Same as before)
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
