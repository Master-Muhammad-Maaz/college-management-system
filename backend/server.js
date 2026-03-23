const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes"); // NEW: Assignment Route

const app = express();

// 1. CORS Configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

/**
 * STATIC FOLDERS CONFIGURATION
 * Providing access to general uploads and assignment-specific folders
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// NEW: Automatically create assignment directory if it doesn't exist
const assignmentDir = path.join(__dirname, 'uploads', 'assignments');
if (!fs.existsSync(assignmentDir)){
    fs.mkdirSync(assignmentDir, { recursive: true });
}

// 3. MongoDB Connection & Index Cleanup logic
mongoose.connect("mongodb://127.0.0.1:27017/erepository")
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    
    // --- AUTO-CLEANUP START ---
    try {
      const collection = mongoose.connection.collection("studentrecords");
      const currentIndexes = await collection.indexes();
      const indexNames = currentIndexes.map(idx => idx.name);

      // Dropping legacy indexes to prevent duplicate key errors
      if (indexNames.includes("srNo_1")) {
        await collection.dropIndex("srNo_1");
        console.log("⚠️ Legacy 'srNo_1' index has been removed.");
      }
      
      if (indexNames.includes("name_1")) {
        await collection.dropIndex("name_1");
        console.log("⚠️ Legacy 'name_1' index has been removed.");
      }

      console.log("🚀 New Composite Index is ready for activation.");
    } catch (err) {
      console.log("ℹ️ Index Cleanup: All indexes are up to date.");
    }
    // --- AUTO-CLEANUP END ---
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// --- DOWNLOAD API ROUTE ---
app.get('/api/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await mongoose.model('File').findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File record not found" });
        }

        const fileNameOnly = path.basename(file.path);
        const filePath = path.join(__dirname, 'uploads', fileNameOnly);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Physical file not found" });
        }

        res.download(filePath, file.name);

    } catch (error) {
        console.error("❌ Download API Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 4. Base Route
app.get("/", (req, res) => {
  res.send("E-Repository Backend is Running...");
});

// 5. API Routes
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes); // Registered Assignment API

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});