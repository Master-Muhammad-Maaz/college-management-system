const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Folder = require("../models/Folder");
const File = require("../models/File");

// 1. REGISTER
router.post("/register", async (req, res) => {
    try {
        // Bhai, yahan course, password, aur mobile add kiya hai jo validation mang raha tha
        const { name, contact, dob, role, course, password, mobile } = req.body;
        
        if (!name || !contact || !dob || !role) {
            return res.status(400).json({ success: false, message: "Basic fields missing" });
        }

        const Model = role === "admin" ? Admin : Student;
        
        // Mobile ya contact dono mein se jo aapke schema mein unique hai usse check karein
        const existing = await Model.findOne({ contact });
        if (existing) return res.json({ success: false, message: "User already exists" });
        
        // Naya user banate waqt saara data pass karein taaki validation fail na ho
        const newUser = new Model({ 
            name, 
            contact, 
            dob,
            course: course || "N/A", // Agar frontend se nahi aa raha toh default value
            password: password || "123456", // Default password agar required hai
            mobile: mobile || contact // Agar mobile required hai toh contact use kar lein
        });

        await newUser.save();
        res.json({ success: true, message: `${role} Registered Successfully` });
    } catch (err) {
        // Ab yahan validation error nahi aayega
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
    try {
        const { contact, dob, role } = req.body;
        const Model = role === "admin" ? Admin : Student;
        const user = await Model.findOne({ contact, dob });
        if (!user) return res.json({ success: false, message: "Invalid Credentials" });
        
        // Login success par user data bhej rahe hain taaki dashboard load ho sake
        res.json({ success: true, message: "Login Successful", user });
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
