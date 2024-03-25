const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

// Modify Multer storage to specify filename with .mp3 extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Create table if not exists
  const createTableQuery = `CREATE TABLE IF NOT EXISTS ar_app_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lon DECIMAL(10, 7),
    lat DECIMAL(10, 8),
    text TEXT,
    animations_string TEXT,
    mp3_path VARCHAR(255),
    model_name VARCHAR(255)
  )`;
  db.query(createTableQuery, (createErr, result) => {
    if (createErr) {
      console.error("Error creating table:", createErr);
      return;
    }
    console.log("Table 'ar_app_data' created successfully (if not exists)");
  });
});

// Route for posting data
app.post("/arapp", upload.single("mp3"), (req, res) => {
  const { lon, lat, text, animations_string, model_name } = req.body;
  const mp3_path = req.file ? `uploads/${req.file.filename}` : null; // Construct MP3 file path

  const sql =
    "INSERT INTO ar_app_data (lon, lat, text, animations_string, mp3_path, model_name) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [lon, lat, text, animations_string, mp3_path, model_name],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res
        .status(200)
        .json({ message: "Data inserted successfully", id: result.insertId });
    }
  );
});

// Route for searching data
app.get("/arapp/search", (req, res) => {
  const { lon, lat } = req.query;

  const sql = "SELECT * FROM ar_app_data WHERE lon = ? AND lat = ?";
  db.query(sql, [lon, lat], (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(data);
  });
});

// Route for viewing all data
app.get("/arapp", (req, res) => {
  const sql = "SELECT * FROM ar_app_data";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(data);
  });
});

// Route for getting MP3 files based on mp3_path
app.get("/uploads/:mp3Path", (req, res) => {
  const mp3Path = req.params.mp3Path;
  const filePath = path.join(__dirname, "uploads", mp3Path); // Construct the file path
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
