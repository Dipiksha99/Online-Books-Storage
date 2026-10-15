const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================
router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    // console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Unable to register user.",
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    // Do not log passwords or password hashes.
    // console.log("Login email:", email);
    // console.log("Database:", User.db.name);
    // console.log("User found:", Boolean(user));

    // console.log(
    //   "Emails in collection:",
    //   await User.find({}, { email: 1, _id: 0 }).lean(),
    // );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    // console.log("Password matched:", passwordMatched);

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Only admins can access the admin login.
    // if (user.role !== "admin") {
    //   return res.status(403).json({
    //     message: "Access denied. Admin account required.",
    //   });
    // }

    if (!process.env.JWT_SECRET) {
      // console.error("JWT_SECRET is missing from environment.");
      return res.status(500).json({
        message: "Server authentication configuration error.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role,
    });
  } catch (error) {
    // console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed due to a server error.",
    });
  }
});

module.exports = router;
