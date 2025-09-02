const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
require("dotenv").config();

const pool = require("./database");
const authenticateToken = require("./token");
const { uploadToS3 } = require("./s3Uploader");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer en memoria
const upload = multer();

// POST productos con imagen
app.post(
  "/api/productos",
  authenticateToken,
  upload.single("img_producto"),
  async (req, res) => {
    try {
      const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } =
        req.body;

      if (!nombre_producto || !precio_unitario || !desc_breve || !req.file) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const uploadResult = await uploadToS3(req.file.buffer, fileName);

      const query = `
        INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        nombre_producto,
        parseFloat(precio_unitario),
        precio_x_mayor ? parseFloat(precio_x_mayor) : null,
        uploadResult.Location,
        desc_breve,
      ];

      const result = await pool.query(query, values);
      io.emit("productoCreado", result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({ message: "Error al crear el producto." });
    }
  }
);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
