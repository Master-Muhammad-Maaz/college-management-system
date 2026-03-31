const express = require("express");
const router = express.Router(); // <--- Ye line missing thi
const Admin = require("../models/Admin");
const Student = require("../models/Student");

// 1. REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password } = req.body;
        
        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (role === "student") {
            const existing = await Student.findOne({ mobile: contact });
            if (existing) return res.json({ success: true, message: "Already exists" });

            const newStudent = new Student({
                name,
                mobile: contact, 
                dob,
                password: password || "123456",
                course: course || null
            });
            await newStudent.save();
            res.json({ success: true, message: "Student Registered" });
        } else {
            const newAdmin = new Admin({ name, contact, dob });
            await newAdmin.save();
            res.json({ success: true, message: "Admin Registered" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;
        
        if (role === "student") {
            const user = await Student.findOne({ mobile: contact, dob }); 
            if (!user) return res.json({ success: false, message: "Invalid Credentials" });
            res.json({ success: true, message: "Login Successful", user });
        } else {
            const user = await Admin.findOne({ contact, dob });
            if (!user) return res.json({ success: false, message: "Invalid Credentials" });
            res.json({ success: true, message: "Login Successful", user });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router; // <--- Ye export hona bhi zaroori hai
