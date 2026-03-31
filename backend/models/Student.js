const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, 
  dob: { type: String, required: true },
  password: { type: String, required: true },
  course: { type: String, required: true, enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"] }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
