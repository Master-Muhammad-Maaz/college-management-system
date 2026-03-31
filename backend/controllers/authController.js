const Student = require("../models/Student");
const Admin = require("../models/Admin");

// 1. LOGIN (Student aur Admin dono ke liye)
exports.login = async (req, res) => {
  try {
    const { contact, dob, role } = req.body;

    if (!contact || !dob) {
      return res.status(400).json({ success: false, message: "Mobile and DOB are required" });
    }

    const cleanContact = contact.trim();
    const cleanDob = dob.trim();

    // AGAR ADMIN LOGIN KAR RAHA HAI
    if (role === "admin") {
      const admin = await Admin.findOne({ contact: cleanContact, dob: cleanDob });
      if (!admin) {
        return res.json({ success: false, message: "Invalid Admin Credentials" });
      }
      return res.json({ success: true, message: "Admin Login Successful", user: admin });
    }

    // AGAR STUDENT LOGIN KAR RAHA HAI (Wahi logic jo Success hua tha)
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
      user: student 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// 2. REGISTER (Admin aur Student dono handle karega)
exports.register = async (req, res) => {
  try {
    const { name, contact, dob, role, course, password } = req.body;

    if (!name || !contact || !dob || !role) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const cleanContact = contact.trim();
    const cleanDob = dob.trim();

    if (role === "admin") {
      const newAdmin = new Admin({ name: name.trim(), contact: cleanContact, dob: cleanDob });
      await newAdmin.save();
      return res.json({ success: true, message: "Admin Registered" });
    }

    const newStudent = new Student({
      name: name.trim(),
      mobile: cleanContact,
      contact: cleanContact,
      dob: cleanDob,
      password: password || "123456",
      course: course || "General"
    });

    await newStudent.save();
    res.json({ success: true, message: "Student Registered" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
