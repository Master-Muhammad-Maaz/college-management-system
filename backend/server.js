const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();

// 1. CORS Configuration
// Added your Vercel URL to the allowed origins to fix the connection error
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "https://college-management-system123.vercel.app",
    "https://college-management-system123-cogq8band.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

/**
 * STATIC FOLDERS CONFIGURATION
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const assignmentDir = path.join(__dirname, 'uploads', 'assignments');
if (!fs.existsSync(assignmentDir)){
    fs.mkdirSync(assignmentDir, { recursive: true });
}

// 3. MongoDB Connection
// Updated to use your MongoDB Atlas Cloud URI for production
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    
    try {
      const collection = mongoose.connection.collection("studentrecords");
      const currentIndexes = await collection.indexes();
      const indexNames = currentIndexes.map(idx => idx.name);

      if (indexNames.includes("srNo_1")) {
        await collection.dropIndex("srNo_1");
        console.log("⚠️ Legacy index 'srNo_1' removed.");
      }
      
      if (indexNames.includes("name_1")) {
        await collection.dropIndex("name_1");
        console.log("⚠️ Legacy index 'name_1' removed.");
      }

      console.log("🚀 Database indexes are optimized.");
    } catch (err) {
      console.log("ℹ️ Index Status: Optimized.");
    }
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
            return res.status(404).json({ success: false, message: "Physical file not found on server" });
        }

        res.download(filePath, file.name);

    } catch (error) {
        console.error("❌ Download API Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during download" });
    }
});

// 4. Base Route
app.get("/", (req, res) => {
  res.send("E-Repository API is active and running.");
});

// 5. API Routes
app.use("/api", authRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "An unexpected error occurred on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
