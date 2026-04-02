const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");

// 1. REGISTER ROUTE (Student & Admin)
router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role, course, password, email, rollNo, profilePic } = req.body;

        // --- NEW STUDENT REGISTRATION LOGIC (Portal 2.0) ---
        if (role === "student") {
            // Naye portal ke liye validation
            if (!name || !email || !password || !rollNo || !course) {
                return res.status(400).json({ success: false, message: "Required fields missing for student" });
            }

            const cleanEmail = email.toLowerCase().trim();

            // Check if student exists by Email or RollNo
            const existing = await Student.findOne({ 
                $or: [{ email: cleanEmail }, { rollNo: rollNo }] 
            });

            if (existing) {
                return res.json({ success: false, message: "Student already exists with this Email or Roll No" });
            }

            const newStudent = new Student({
                name: name.trim(),
                email: cleanEmail,
                password: password,
                rollNo: rollNo,
                course: course,
                profilePic: profilePic || "",
                // Purane compatibility ke liye (agar model mein required hain)
                contact: contact || rollNo, 
                dob: dob || "2000-01-01" 
            });

            await newStudent.save();
            return res.json({ success: true, message: "Student Registered Successfully" });

        } else {
            // --- OLD ADMIN REGISTRATION (UNCHANGED) ---
            if (!name || !contact || !dob) {
                return res.status(400).json({ success: false, message: "Required fields missing for admin" });
            }

            const cleanContact = contact.trim();
            const cleanDob = dob.trim();

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

// 2. LOGIN ROUTE (Student & Admin)
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role, email, password } = req.body;

        // --- NEW STUDENT LOGIN LOGIC (Email & Password) ---
        if (role === "student") {
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and Password are required" });
            }

            const user = await Student.findOne({
                email: email.toLowerCase().trim(),
                password: password
            });

            if (!user) {
                return res.json({ success: false, message: "Invalid Email or Password" });
            }

            res.json({ success: true, message: "Login Successful", user });

        } else {
            // --- OLD ADMIN LOGIN LOGIC (UNCHANGED) ---
            if (!contact || !dob) {
                return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
            }

            const cleanContact = contact.trim();
            const cleanDob = dob.trim();

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
