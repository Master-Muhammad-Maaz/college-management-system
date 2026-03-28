const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");    

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignments"); // Ensure name matches your file

const app = express();

// 1. IMPROVED CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "https://college-management-system123.vercel.app",
  "https://college-management-system-bdci.vercel.app",
  "https://college-management-system-lac.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
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
 * Isse students uploaded assignments view/download kar sakenge
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Directory creation logic (Render startup ke liye zaroori hai)
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
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    
    // Index management logic for studentrecords
    try {
      const collection = mongoose.connection.collection("studentrecords");
      const currentIndexes = await collection.indexes();
      const indexNames = currentIndexes.map(idx => idx.name);

      if (indexNames.includes("srNo_1")) await collection.dropIndex("srNo_1");
      if (indexNames.includes("name_1")) await collection.dropIndex("name_1");

      console.log("🚀 Database indexes are optimized.");
    } catch (err) {
      console.log("ℹ️ Index Management: Handled.");
    }
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); 
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
            return res.status(404).json({ success: false, message: "File missing from server" });
        }

        res.download(filePath, file.name);

    } catch (error) {
        console.error("❌ Download API Error:", error);
        res.status(500).json({ success: false, message: "Server error during download" });
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
// Is path se Student Dashboard latest alert fetch karega
app.use("/api/assignments", assignmentRoutes); 

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

/**
 * FINAL PORT BINDING FOR RENDER
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live and listening on port: ${PORT}`);
});
