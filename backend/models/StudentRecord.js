const mongoose = require("mongoose");

const studentRecordSchema = new mongoose.Schema({
  srNo: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  mobile: { type: String, required: true },
  course: { 
    type: String, 
    required: true, 
    enum: ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  }
}, { timestamps: true });

studentRecordSchema.index({ srNo: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("StudentRecord", studentRecordSchema);
