const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, // Admin jo naam rakhega
  course: { type: String, required: true },   // B.Sc-I, M.Sc-II etc.
  semester: { type: String, required: true }, // Sem-1, Sem-2 etc.
  type: { type: String, enum: ["file", "text"], required: true },
  content: { type: String }, // Agar text likha ho
  fileUrl: { type: String },  // Agar file upload ki ho
  teacherName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  deadline: { type: String }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);