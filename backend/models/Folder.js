const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    default: null  // Agar null hai toh wo main dashboard pe dikhega
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Folder", folderSchema);