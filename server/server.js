const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//------------------------------------------------------------
app.use(express.static(path.join(__dirname, "QRbuild")));
app.use(express.static(path.join(__dirname, "speechBuild")));
app.use(express.static(path.join(__dirname, "navBuild")));

//QR page
app.get("/qr", function (req, res) {
  res.sendFile(path.join(__dirname, "QRbuild", "index.html"));
});

//text-to-speech page
app.get("/text-to-speech", function (req, res) {
  res.sendFile(path.join(__dirname, "speechBuild", "index.html"));
});

//navigation page
app.get("/navigation", function (req, res) {
  res.sendFile(path.join(__dirname, "navBuild", "index.html"));
});
//------------------------------------------------------------

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString("hex");

// Configure session middleware
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName =
      uniqueSuffix +
      "-" +
      file.originalname.replace(fileExtension, "") +
      fileExtension;
    cb(null, fileName);
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
    qr_image_path VARCHAR(255),
    navigation TEXT,
    text TEXT,
    animations_string TEXT,
    mp3_path VARCHAR(255),
    model_name VARCHAR(255),
    word_timings TEXT,
    cm_from_ground DECIMAL(10,2) DEFAULT NULL,
    cm_out_of_wall DECIMAL(10,2) DEFAULT NULL,
    QR_placement_choice ENUM('Wall', 'Desk')
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
app.post(
  "/arapp",
  upload.fields([
    { name: "mp3", maxCount: 1 },
    { name: "qr_image", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      navigation,
      text,
      animations_string,
      model_name,
      word_timings,
      cm_from_ground,
      cm_out_of_wall,
      QR_placement_choice,
    } = req.body;

    const mp3_path = req.files["mp3"]
      ? `uploads/${req.files["mp3"][0].filename}`
      : null;
    const qr_image_path = req.files["qr_image"]
      ? `uploads/${req.files["qr_image"][0].filename}`
      : null;

    const sql =
      "INSERT INTO ar_app_data (qr_image_path, navigation, text, animations_string, mp3_path, model_name, word_timings, cm_from_ground, cm_out_of_wall, QR_placement_choice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        qr_image_path,
        navigation,
        text,
        animations_string,
        mp3_path,
        model_name,
        word_timings,
        cm_from_ground,
        cm_out_of_wall,
        QR_placement_choice,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (req.session) {
          req.session.ar_experience_id = result.insertId;
        } else {
          console.error("No request session");
        }

        return res.status(200).json({
          message: "Data inserted successfully",
          insert_id: result.insertId,
          ar_experience_id: req.session.ar_experience_id, // Fixed typo here
        });
      }
    );
  }
);

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

// Route for updating navigation text for an existing row based on id
app.post("/arapp/navigation/:id", (req, res) => {
  const { id } = req.params;
  const { navigation } = req.body;

  // Convert the navigation object to a string before storing in the database
  const stringifiedNavigation = JSON.stringify(navigation);

  const sql = "UPDATE ar_app_data SET navigation = ? WHERE id = ?";
  db.query(sql, [stringifiedNavigation, id], (err, result) => {
    if (err) {
      console.error("Error updating navigation text:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    return res.status(200).json({
      message: "Navigation text updated successfully",
      ar_experience_id: req.session.ar_experience_id,
    });
  });
});

// Route for posting QR image which creates a new row
app.post("/arapp/qrimage", upload.single("qr_image"), (req, res) => {
  const { cm_from_ground, cm_out_of_wall, qr_placement_choice } = req.body;
  if (req.file) {
    console.log("The request includes a file");
  } else {
    console.log("File is null");
  }
  const qr_image_path = req.file ? `uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO ar_app_data 
          (qr_image_path, navigation, text, animations_string, mp3_path, model_name, word_timings, cm_from_ground, cm_out_of_wall, QR_placement_choice) 
          VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?, ?)`;
  const params = [
    qr_image_path,
    cm_from_ground,
    cm_out_of_wall,
    qr_placement_choice,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error inserting QR image:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (req.session) {
      req.session.ar_experience_id = result.insertId;
    } else {
      console.error("No request session");
    }

    return res.status(200).json({
      message: "QR image inserted successfully",
      insert_id: result.insertId,
      ar_experience_id: req.session.ar_experience_id,
    });
  });
});

// Route for updating word timings for an existing row based on id
app.post("/arapp/wordtimings/:id", (req, res) => {
  const { id } = req.params;
  const { word_timings } = req.body;

  // Convert the word_timings object to a string before storing in the database
  const stringifiedWordTimings = JSON.stringify(word_timings);

  const sql = "UPDATE ar_app_data SET word_timings = ? WHERE id = ?";
  db.query(sql, [stringifiedWordTimings, id], (err, result) => {
    if (err) {
      console.error("Error updating word timings:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    return res.status(200).json({
      message: "Word timings updated successfully",
      ar_experience_id: req.session.ar_experience_id,
    });
  });
});

// Route for uploading mp3 file and updating mp3 path for an existing row based on id
app.post("/arapp/mp3/:id", upload.single("mp3"), (req, res) => {
  const id = req.params.id; // Extract ID from the URL

  if (!req.file) {
    return res.status(400).json({ error: "No MP3 file uploaded" });
  }

  const mp3_path = `uploads/${req.file.filename}`;

  const sql = "UPDATE ar_app_data SET mp3_path = ? WHERE id = ?";
  db.query(sql, [mp3_path, id], (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    return res.status(200).json({
      message: "MP3 file uploaded successfully",
      ar_experience_id: req.session.ar_experience_id,
    });
  });
});

// Route for getting MP3 files based on mp3_path
app.get("/uploads/:mp3Path", (req, res) => {
  const mp3Path = req.params.mp3Path;
  const filePath = path.join(__dirname, "uploads", mp3Path);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// Route for the client to get the session id
app.get("/get-session-data", (req, res) => {
  const arExperienceId = req.session.ar_experience_id;
  res.json({ ar_experience_id: arExperienceId });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}`);
});
