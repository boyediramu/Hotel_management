const express = require("express");
const { db } = require("../config/database");

const router = express.Router();

// Admin management routes can be added here
// For now, admin functionality is handled in auth.js

// Future admin-specific routes:
// - GET /profile - Get admin profile
// - PUT /profile - Update admin profile
// - GET /settings - Get admin settings
// - PUT /settings - Update admin settings

module.exports = router;
