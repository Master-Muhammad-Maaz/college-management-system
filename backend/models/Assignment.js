const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  course: { type: String, required: true },   
  semester: { type: String, required: true }, 
  type: { type: String, enum: ["file", "text"], required: true },
  content: { type: String }, 
  fileUrl: { type: String },  
  teacherName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  // FIX: Changed String to Date for better time-based queries
  deadline: { type: Date } 
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
