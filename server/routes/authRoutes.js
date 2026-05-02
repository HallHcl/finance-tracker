const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const SECRET = "finance_secret_key";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 🔥 check email ซ้ำ
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    await user.save();

    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1d",
    });

    // 🔥 ส่ง user กลับไปด้วย
    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// GET current budget
router.get("/budget", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ budget: user.budget });
});

// UPDATE budget
router.put("/budget", authMiddleware, async (req, res) => {
  const { budget } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { budget },
    { new: true }
  );

  res.json({ budget: user.budget });
});

module.exports = router;