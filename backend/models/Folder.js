const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, default: "General" }, // Student course matching ke liye
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    default: null 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Folder", folderSchema);
