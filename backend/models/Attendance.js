const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "StudentRecord",
    required: true 
  },
  date: { type: String, required: true }, 
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

// Prevent duplicate entries for same student on same day
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
