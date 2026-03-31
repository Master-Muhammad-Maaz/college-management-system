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

// 1. IMPROVED CORS FOR VERCEL & LOCALHOST
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "https://college-management-system-bdci.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("CORS Blocked"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Static folder for files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create upload directories if they don't exist
const uploadDirs = [path.join(__dirname, 'uploads'), path.join(__dirname, 'uploads', 'assignments')];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 2. MONGODB CONNECTION (Atlas)
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1); 
  });

// 3. API ROUTES
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 

app.get("/", (req, res) => res.send("API is active."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
