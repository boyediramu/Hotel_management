const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import route modules
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const roomRoutes = require("./routes/rooms");
const guestRoutes = require("./routes/guests");

// Import database configuration (connection is established in config/database.js)
require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/guests", guestRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Hotel Management API is running",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hotel Management Backend running on http://localhost:${PORT}`);
});
