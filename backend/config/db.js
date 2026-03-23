const mongoose = require("mongoose");

/**
 * Database Connection Configuration
 * Prioritizes the Cloud MongoDB URI from environment variables for production.
 */
const connectDB = async () => {
  try {
    // 1. Connection string selection (Cloud Atlas for production / Local for dev)
    const connString = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";
    
    // 2. Establish connection with stability options
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    // 3. Exit process with failure code if database cannot be reached
    process.exit(1); 
  }
};

module.exports = connectDB;
