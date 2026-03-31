const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, 
  dob: { type: String, required: true },
  password: { type: String, required: false }, // Optional
  course: { 
    type: String, 
    required: false, 
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II", null] // Null allowed
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
