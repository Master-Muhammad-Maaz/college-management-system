const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// --- ROUTES IMPORTS ---
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignments"); 
const repoRoutes = require("./routes/repoRoutes");
const contentRoutes = require("./routes/contentRoutes"); // Drive Logic

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
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. MIDDLEWARE
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// STATIC FOLDERS SETUP
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads', 'assignments'),
  path.join(__dirname, 'uploads', 'repository'),
  path.join(__dirname, 'uploads', 'portal')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. DATABASE CONNECTION
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// 4. API ROUTES
app.get("/", (req, res) => {
    res.status(200).send("College Management System API is active.");
});

// Purana Logic & Naya Portal Logic (Dono handle ho rahe hain)
app.use("/api/auth", authRoutes); 
app.use("/api/portal-auth", authRoutes); // Portal 2.0 ke liye
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 
app.use("/api", repoRoutes);
app.use("/api/content", contentRoutes);

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error", detail: err.message });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
