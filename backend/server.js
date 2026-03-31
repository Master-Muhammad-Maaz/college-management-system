const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignments"); 

const app = express();

// 1. CORS CONFIGURATION (Updated for flexibility)
const allowedOrigins = [
  "http://localhost:3000", 
  "https://college-management-system123.vercel.app",
  "https://college-management-system-bdci.vercel.app",
  "https://college-management-system-lac.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Vercel ke subdomains aur local ko allow karne ke liye
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// STATIC FOLDERS setup
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'assignments')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// 4. API Routes (FIXED PATHS TO MATCH FRONTEND)
app.get("/", (req, res) => res.send("College Management System API is active."));

// frontend 'api/auth/login' use kar raha hai isliye yahan /api/auth hona chahiye
app.use("/api/auth", authRoutes); 
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error", detail: err.message });
});

/**
 * FINAL PORT BINDING
 */
const PORT = process.env.PORT || 10000; // Render usually uses 10000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
