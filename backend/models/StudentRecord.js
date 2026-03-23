const mongoose = require("mongoose");

const studentRecordSchema = new mongoose.Schema({
  srNo: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  mobile: { type: String, required: true },
  course: { 
    type: String, 
    required: true, 
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"],
    default: "B.Sc-I"
  }
}, { timestamps: true });

// SR No aur Course ka combination unique hona chahiye taake B.Sc-I aur M.Sc-I dono mein Roll 1 reh sake
studentRecordSchema.index({ srNo: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("StudentRecord", studentRecordSchema);