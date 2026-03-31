const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  // Unique identification ke liye mobile use kar rahe hain
  mobile: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  }, 
  // Purane records (SAAD) ko support karne ke liye contact field (Optional)
  contact: {
    type: String,
    required: false,
    trim: true
  },
  dob: { 
    type: String, 
    required: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: false, 
    default: "123456" 
  },
  course: { 
    type: String, 
    required: false, 
    // FIX: "General" aur "Not Assigned" add kiya gaya hai validation error rokne ke liye
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II", "General", "Not Assigned", null],
    default: "General"
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
