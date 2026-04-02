const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Folder ya File ka naam
  type: { type: String, enum: ["folder", "file"], required: true },
  category: { type: String, enum: ["notes", "assignments"], required: true },
  course: { type: String, required: true }, // B.Sc-I, M.Sc-II etc.
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", default: null }, // Nested folders ke liye
  fileUrl: { type: String, default: "" }, // Agar file hai toh uska link
  size: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);
