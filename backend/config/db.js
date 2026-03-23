const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the environment variable for production, fallback to local only for development
    const connString = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";
    
    await mongoose.connect(connString);

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if the database fails
  }
};

module.exports = connectDB;
