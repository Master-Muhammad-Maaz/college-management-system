const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "StudentRecord", 
    required: true 
  },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { 
    type: String, 
    enum: ["Present", "Absent", "Holiday"], 
    default: "Present" 
  },
  course: { 
    type: String, 
    required: true,
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  }
}, { timestamps: true });

// Indexing for unique daily entry
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
