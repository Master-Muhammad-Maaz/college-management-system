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
  deadline: { type: Date },
  
  // 🚀 Naya Field: Batch-wise sorting ke liye
  // Ye field connect karegi assignment ko uske sahi folder se (e.g. B.Sc folder)
  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Folder", 
    required: true 
  }
}, { 
  timestamps: true // Isse 'createdAt' mil jayega dashboard notifications ke liye
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
