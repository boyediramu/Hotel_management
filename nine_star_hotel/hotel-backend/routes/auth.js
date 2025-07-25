const express = require("express");
const { db } = require("../config/database");

const router = express.Router();

// Get all admins
router.get("/admins", (req, res) => {
  db.query("SELECT * FROM admin", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Login endpoint
router.post("/admins/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // For demo purposes, use hardcoded credentials
  // In production, you should hash passwords and store them in database
  if (email === "admin@gmail.com" && password === "123456") {
    res.json({
      success: true,
      email: email,
      role: "admin",
      message: "Login successful"
    });
  } else {
    res.status(401).json({
      message: "Invalid email or password"
    });
  }
});

module.exports = router;
