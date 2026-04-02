const express = require("express");
const router = express.Router();
const StudentAuth = require("../models/StudentAuth");

// ==========================================
// 1. STUDENT REGISTRATION (Portal 2.0)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, rollNo, course, profilePic } = req.body;

    // Sabhi fields ko check kar rahe hain (Required Fields Missing error fix)
    if (!name || !email || !password || !rollNo || !course) {
      return res.status(400).json({ 
        success: false, 
        message: "Opps! Sabhi details bharna zaroori hain." 
      });
    }

    // Email duplicate check
    const existingStudent = await StudentAuth.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: "Ye Email pehle se registered hai!" 
      });
    }

    // Naya Student create karna
    const newStudent = new StudentAuth({
      name,
      email: email.toLowerCase(),
      password, // Note: Aap baad mein ise bcrypt se secure kar sakte hain
      rollNo,
      course,
      profilePic: profilePic || ""
    });

    await newStudent.save();

    res.status(201).json({ 
      success: true, 
      message: "Mubarak ho! Registration Successful." 
    });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Registration fail ho gaya.",
      error: err.message 
    });
  }
});

// ==========================================
// 2. STUDENT LOGIN (Portal 2.0)
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email aur Password dono chahiye." 
      });
    }

    // Student ko dhoondna
    const student = await StudentAuth.findOne({ 
      email: email.toLowerCase(), 
      password: password 
    });

    if (!student) {
      return res.status(401).json({ 
        success: false, 
        message: "Galat Email ya Password!" 
      });
    }

    // Login hone par zaroori data bhejna
    res.json({
      success: true,
      message: "Login Successful!",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
        profilePic: student.profilePic
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server par koi masla hai." 
    });
  }
});

module.exports = router;
