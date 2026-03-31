const express = require("express");
const router = express.Router(); 
const Admin = require("../models/Admin");
const Student = require("../models/Student");

// 1. REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password } = req.body;
        
        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        // String clean karne ke liye (Spaces hatane ke liye)
        const cleanContact = contact.trim();

        if (role === "student") {
            const existing = await Student.findOne({ mobile: cleanContact });
            if (existing) return res.json({ success: false, message: "User already exists with this mobile number" });

            const newStudent = new Student({
                name: name.trim(),
                mobile: cleanContact, 
                dob: dob.trim(),
                password: password || "123456",
                course: course || null
            });
            await newStudent.save();
            res.json({ success: true, message: "Student Registered Successfully" });
        } else {
            const newAdmin = new Admin({ 
                name: name.trim(), 
                contact: cleanContact, 
                dob: dob.trim() 
            });
            await newAdmin.save();
            res.json({ success: true, message: "Admin Registered Successfully" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Registration Error: " + err.message });
    }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;
        
        if (!contact || !dob) {
            return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
        }

        const cleanContact = contact.trim();
        const cleanDob = dob.trim();

        if (role === "student") {
            // Mobile aur DOB dono match hone chahiye
            const user = await Student.findOne({ mobile: cleanContact, dob: cleanDob }); 
            
            if (!user) {
                return res.json({ success: false, message: "Invalid Credentials. Please check Mobile/DOB." });
            }
            
            res.json({ success: true, message: "Login Successful", user });
        } else {
            const user = await Admin.findOne({ contact: cleanContact, dob: cleanDob });
            if (!user) return res.json({ success: false, message: "Invalid Admin Credentials" });
            res.json({ success: true, message: "Admin Login Successful", user });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

module.exports = router;
