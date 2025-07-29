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

// Login endpoint - Database validation
router.post("/admins/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  // Query database for user
  const query = `
    SELECT admin_id, username, email, full_name, role, is_active, password
    FROM admin
    WHERE email = ? AND is_active = 1
  `;

  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Login query error:', error);
      return res.status(500).json({
        success: false,
        message: "Database error during login"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    const updateQuery = `UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE admin_id = ?`;
    db.query(updateQuery, [user.admin_id], (updateError) => {
      if (updateError) {
        console.error('Update last login error:', updateError);
      }
    });

    // Return user data (excluding password)
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.admin_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  });
});

// POST /logout - Admin logout
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful"
  });
});

// GET /verify - Verify if user is still logged in (for session persistence)
router.get("/verify", (req, res) => {
  // In a real app, you'd verify JWT token or session
  // For now, just return success to allow frontend session management
  res.json({
    success: true,
    message: "Session valid"
  });
});

module.exports = router;
