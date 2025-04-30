import express from "express";
import mysql from "mysql";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
  database: "test",
});

// Upload configuration using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Routes
app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
  const values = [req.body.title, req.body.desc, req.body.price, req.body.cover];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [req.body.title, req.body.desc, req.body.price, req.body.cover];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(80, () => {
  console.log("Connected to backend.");
});
