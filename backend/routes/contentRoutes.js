// testing build
const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

// 1. GET ALL ITEMS (Folders/Files) based on Course, Category & ParentId
router.get("/list", async (req, res) => {
  try {
    const { course, category, parentId } = req.query;
    const query = { course, category, parentId: parentId || null };
    const items = await Content.find(query).sort({ type: 1, name: 1 }); // Folders pehle aayenge
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. CREATE NEW FOLDER
router.post("/create-folder", async (req, res) => {
  try {
    const { name, course, category, parentId } = req.body;
    const newFolder = new Content({ name, type: "folder", course, category, parentId });
    await newFolder.save();
    res.json({ success: true, folder: newFolder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Folder create nahi ho saka." });
  }
});

// 3. DELETE ITEM (Recursive delete for folders next step mein karenge)
router.delete("/delete/:id", async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;
