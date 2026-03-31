const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Ensure these filenames match EXACTLY in your routes folder
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignments"); 

const app = express();
app.use(cors());
app.use(express.json());

// Setup uploads folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir, { recursive: true }); }
app.use("/uploads", express.static(uploadDir));

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
  });

// API Routes
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); 

app.get("/", (req, res) => res.send("API is Live and Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
