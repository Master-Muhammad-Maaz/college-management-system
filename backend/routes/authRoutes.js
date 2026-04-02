const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");

// 1. REGISTER ROUTE (Student & Admin)
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password } = req.body;

        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const cleanContact = contact.trim();
        const cleanDob = dob.trim(); 

        if (role === "student") {
            // Check if student already exists
            const existing = await Student.findOne({
                $or: [{ mobile: cleanContact }, { contact: cleanContact }]
            });

            if (existing) {
                return res.json({ success: false, message: "User already exists with this number" });
            }

            const newStudent = new Student({
                name: name.trim(),
                mobile: cleanContact,
                contact: cleanContact, // Saving in both for safety
                dob: cleanDob, 
                password: password || "123456",
                course: course || "General"
            });

            await newStudent.save();
            res.json({ success: true, message: "Student Registered Successfully" });
        } else {
            // Admin Registration
            const existingAdmin = await Admin.findOne({ contact: cleanContact });
            if (existingAdmin) {
                return res.json({ success: false, message: "Admin already exists with this number" });
            }

            const newAdmin = new Admin({
                name: name.trim(),
                contact: cleanContact,
                dob: cleanDob
            });

            await newAdmin.save();
            res.json({ success: true, message: "Admin Registered Successfully" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Registration Error: " + err.message });
    }
});

// 2. LOGIN ROUTE (Dono Roles ke liye Fixed Logic)
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;

        if (!contact || !dob) {
            return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
        }

        const cleanContact = contact.trim();
        const cleanDob = dob.trim();

        if (role === "student") {
            // Wahi logic jo success hua tha
            const user = await Student.findOne({
                $or: [
                    { mobile: cleanContact },
                    { contact: cleanContact }
                ],
                dob: cleanDob
            });

            if (!user) {
                return res.json({ 
                    success: false, 
                    message: "Invalid Credentials. Use YYYY-MM-DD format (e.g., 2003-09-09)" 
                });
            }

            res.json({ success: true, message: "Login Successful", user });
        } else {
            // Admin Login Logic
            const user = await Admin.findOne({
                contact: cleanContact,
                dob: cleanDob
            });

            if (!user) {
                return res.json({ 
                    success: false, 
                    message: "Invalid Admin Credentials. Check Number and DOB (YYYY-MM-DD)." 
                });
            }

            res.json({ success: true, message: "Admin Login Successful", user });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

module.exports = router;
