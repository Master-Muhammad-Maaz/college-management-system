const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },

  mobile: { 
    type: String, 
    required: true, 
    unique: true, // Naye records ke liye unique zaroori hai
    trim: true 
  }, 

  contact: {
    type: String,
    required: false, // Purane records (SAAD etc.) ko support karne ke liye
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
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II", "General", "Not Assigned", null],
    default: "General"
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
