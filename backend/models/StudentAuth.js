const mongoose = require("mongoose");

const studentAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNo: { type: String, required: true },
  course: { 
    type: String, 
    required: true, 
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II", "M.Sc-III"]
  },
  profilePic: { type: String, default: "" }, // Photo URL base64 ya cloud link
  isApproved: { type: Boolean, default: true } // Admin control ke liye
}, { timestamps: true });

module.exports = mongoose.model("StudentAuth", studentAuthSchema);
