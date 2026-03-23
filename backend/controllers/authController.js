const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {

  try {

    const { name, contact, dob, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      contact,
      dob,
      password: hashed
    });

    await student.save();

    res.json({ message: "Registration successful" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.loginStudent = async (req, res) => {

  const { contact, password } = req.body;

  const student = await Student.findOne({ contact });

  if (!student)
    return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, student.password);

  if (!valid)
    return res.status(400).json({ msg: "Wrong password" });

  res.json({ msg: "Login success" });

};