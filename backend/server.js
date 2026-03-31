const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Route Imports - Confirm filenames in your routes folder
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignments"); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static Folders & Auto-Directory Creation
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadDirs = [
  path.join(__dirname, 'uploads'), 
  path.join(__dirname, 'uploads', 'assignments')
];

uploadDirs.forEach(dir => { 
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); 
  }
});

// MongoDB Connection Logic
// Priority: Environment Variable > Manual String
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });

// API Routes Mapping
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 

// Health Check Route
app.get("/", (req, res) => res.send("College Management System API is active."));

// Port Configuration for Render/Heroku/Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
