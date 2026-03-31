router.post("/register", async (req, res) => {
    try {
        const { name, contact, dob, role } = req.body;
        
        if (role === "student") {
            const newStudent = new Student({
                name,
                mobile: contact, // Frontend se 'contact' aa raha hai, Schema mein 'mobile' hai
                dob,
                password: "123", // Default placeholder
                course: null     // Optional handled
            });
            await newStudent.save();
            return res.json({ success: true, message: "Registered!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { contact, dob } = req.body;
        // Map contact to mobile
        const user = await Student.findOne({ mobile: contact, dob: dob });
        
        if (!user) return res.json({ success: false, message: "No student found with these details" });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
