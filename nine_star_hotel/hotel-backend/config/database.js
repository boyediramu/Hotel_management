const mysql = require("mysql2");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "242001",
  database: "hotel_management",
};

// Create database connection
const createConnection = () => {
  const db = mysql.createConnection(dbConfig);
  
  db.connect((err) => {
    if (err) {
      console.error("DB connection failed:", err);
      return;
    }
    console.log("Connected to database");
  });

  return db;
};

// Create a single connection instance
const db = createConnection();

module.exports = {
  db,
  createConnection,
  dbConfig
};
