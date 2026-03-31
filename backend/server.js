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

// 1. CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000", 
  "https://college-management-system123.vercel.app",
  "https://college-management-system-bdci.vercel.app",
  "https://college-management-system-lac.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
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

// STATIC FOLDERS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'assignments')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
});

// 3. MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Render status 1 prevent karne ke liye handle karein
  });

// 4. API Routes
app.get("/", (req, res) => res.send("College Management System API is active."));

app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

/**
 * FINAL PORT BINDING
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
