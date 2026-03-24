const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // FIX: Changed 'contact' to 'mobile' for consistency
  mobile: { type: String, required: true, unique: true },
  dob: { type: String, required: true }
});

module.exports = mongoose.model("Admin", adminSchema);
