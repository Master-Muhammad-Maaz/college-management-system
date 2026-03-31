const Student = require("../models/Student");

// 1. REGISTER STUDENT
exports.registerStudent = async (req, res) => {
  try {
    const { name, contact, dob, course, password } = req.body;

    if (!name || !contact || !dob || !course) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    const cleanContact = contact.trim();
    const cleanDob = dob.trim();

    const student = new Student({
      name: name.trim(),
      mobile: cleanContact, // Naye records mobile field mein jayenge
      contact: cleanContact, // Back-compatibility ke liye contact mein bhi daal dete hain
      dob: cleanDob,
      password: password || "123456",
      course
    });

    await student.save();
    res.json({ success: true, message: "Registration successful" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This mobile number is already registered." });
    }
    res.status(500).json({ error: error.message });
  }
};

// 2. LOGIN STUDENT (Using Mobile & DOB)
exports.loginStudent = async (req, res) => {
  try {
    const { contact, dob } = req.body; // Frontend se 'contact' aur 'dob' aa raha hai

    if (!contact || !dob) {
      return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
    }

    const cleanContact = contact.trim();
    const cleanDob = dob.trim();

    // Password ki jagah DOB se match karenge aur dono fields (mobile/contact) check karenge
    const student = await Student.findOne({
      $or: [
        { mobile: cleanContact },
        { contact: cleanContact }
      ],
      dob: cleanDob
    });

    if (!student) {
      return res.json({ 
        success: false, 
        message: "Invalid Credentials. Use YYYY-MM-DD format (e.g., 2003-09-09)" 
      });
    }

    res.json({ 
      success: true,
      message: "Login success",
      user: student // Frontend 'user' expect kar raha hai
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
