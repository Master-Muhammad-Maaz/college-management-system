const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, 
  dob: { type: String, required: true },
  // Password ko optional kar diya gaya hai
  password: { type: String, required: false }, 
  // Course ko optional kar diya gaya hai aur null allow kiya hai
  course: { 
    type: String, 
    required: false, 
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II", null] 
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
