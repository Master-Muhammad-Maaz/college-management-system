const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Priority: Render Cloud Environment Variable
    const connString = process.env.MONGODB_URI || "mongodb+srv://mohammadmaaz8262:87654321@maaz123.eu2rnw5.mongodb.net/college_db?retryWrites=true&w=majority";
    
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000, 
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
