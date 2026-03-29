const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  try {
    // Added 'course' to destructuring
    const { name, contact, dob, password, course } = req.body;

    if (!course) {
      return res.status(400).json({ error: "Course selection is mandatory (e.g., B.Sc-I)" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      contact,
      dob,
      password: hashed,
      course // Saves student to their specific batch
    });

    await student.save();
    res.json({ success: true, message: "Registration successful" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This contact number is already registered." });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { contact, password } = req.body;
    const student = await Student.findOne({ contact });

    if (!student) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) return res.status(400).json({ msg: "Wrong password" });

    // Response includes student info for frontend redirection
    res.json({ 
      success: true,
      msg: "Login success",
      student: {
        name: student.name,
        course: student.course, // Helps frontend show correct attendance/marks
        contact: student.contact
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
