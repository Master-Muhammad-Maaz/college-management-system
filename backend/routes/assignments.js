const express = require('express');
const router = express.Router();
// Aapka Assignment model yahan import hoga
const Assignment = require('../models/Assignment'); 

// 1. Sabse naya assignment nikaalne ke liye GET route
router.get('/latest', async (req, res) => {
    try {
        // Database se latest entry fetch karna (createdAt ke hisaab se)
        const latest = await Assignment.findOne().sort({ createdAt: -1 });
        
        if (!latest) {
            return res.status(404).json({ success: false, message: "No assignments found" });
        }

        res.json({
            success: true,
            assignment: latest
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
