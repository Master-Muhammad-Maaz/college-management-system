const mongoose = require("mongoose");

/**
 * Database Connection Configuration
 * Prioritizes the Cloud MongoDB URI for production environments.
 */
const connectDB = async () => {
  try {
    // Cloud URI prioritized for Render/Production
    const connString = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";
    
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if DB is unreachable
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Exit process with failure code if database cannot be reached
    process.exit(1); 
  }
};

module.exports = connectDB;
