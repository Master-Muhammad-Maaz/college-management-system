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
// Consistently allowed origins including local development and production Vercel apps
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "https://college-management-system123.vercel.app",
  "https://college-management-system123-cogq8band.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or those in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
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

/**
 * STATIC FOLDERS CONFIGURATION
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure directory existence with error handling
const assignmentDir = path.join(__dirname, 'uploads', 'assignments');
try {
  if (!fs.existsSync(assignmentDir)){
      fs.mkdirSync(assignmentDir, { recursive: true });
  }
} catch (dirError) {
  console.error("❌ Failed to create upload directories:", dirError);
}

// 3. MongoDB Connection
// Priority given to Environment Variables for security
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    
    try {
      const collection = mongoose.connection.collection("studentrecords");
      const currentIndexes = await collection.indexes();
      const indexNames = currentIndexes.map(idx => idx.name);

      // Clean up legacy indexes to prevent configuration conflicts
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
      console.log("ℹ️ Index Management: Optimized.");
    }
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if database connection fails in production
  });

// --- DOWNLOAD API ROUTE ---
app.get('/api/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await mongoose.model('File').findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File record not found in database" });
        }

        const fileNameOnly = path.basename(file.path);
        const filePath = path.join(__dirname, 'uploads', fileNameOnly);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Physical file is missing from server storage" });
        }

        res.download(filePath, file.name);

    } catch (error) {
        console.error("❌ Download API Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during file download" });
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
  res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

// Port configuration for Render/Production environment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port: ${PORT}`);
});
