const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, 
  course: { 
    type: String, 
    required: true,
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  },
  isHoliday: { type: Boolean, default: false },
  attendanceData: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentRecord" },
      status: { type: String, enum: ["PRESENT", "ABSENT", "HOLIDAY"], default: "ABSENT" }
    }
  ]
}, { timestamps: true });

// Ensure one record per course per day
AttendanceSchema.index({ date: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
