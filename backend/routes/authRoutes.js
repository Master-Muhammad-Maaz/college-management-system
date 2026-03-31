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

        const cleanContact = contact.trim();

        if (role === "student") {
            // Check both possible field names in DB: 'mobile' and 'contact'
            const existing = await Student.findOne({ 
                $or: [{ mobile: cleanContact }, { contact: cleanContact }] 
            });
            
            if (existing) return res.json({ success: false, message: "User already exists" });

            const newStudent = new Student({
                name: name.trim(),
                mobile: cleanContact, // Hum naye records 'mobile' field mein hi save karenge
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

// 2. LOGIN (FIXED FOR FIELD MISMATCH)
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;
        
        if (!contact || !dob) {
            return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
        }

        const cleanContact = contact.trim();
        const cleanDob = dob.trim();

        if (role === "student") {
            // FIX: $or operator use kiya hai taaki agar DB mein 'contact' likha ho ya 'mobile', dono match ho jayein
            const user = await Student.findOne({ 
                $or: [
                    { mobile: cleanContact }, 
                    { contact: cleanContact }
                ], 
                dob: cleanDob 
            }); 
            
            if (!user) {
                return res.json({ success: false, message: "Invalid Credentials. Check your details." });
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
