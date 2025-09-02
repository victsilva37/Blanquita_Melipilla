const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
require("dotenv").config();
const pool = require("./database"); // Tu conexión a Postgres
const authenticateToken = require("./token"); // Middleware JWT
const { uploadToS3 } = require("./s3Uploader");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Multer en memoria
const upload = multer();

// WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

// ================== CRUD PRODUCTOS ==================

// GET productos
app.get("/api/productos", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto;");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos." });
  }
});

// POST producto con imagen
app.post(
  "/api/productos",
  authenticateToken,
  upload.single("img_producto"),
  async (req, res) => {
    try {
      const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } = req.body;

      if (!req.file || !nombre_producto || !precio_unitario || !desc_breve) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
      }

      const fileBuffer = req.file.buffer;
      const fileName = `${Date.now()}-${nombre_producto}.jpg`;

      // Subir a S3
      const uploadResult = await uploadToS3(fileBuffer, fileName);

      // Guardar en DB
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
      console.error(error);
      res.status(500).json({ message: "Error al crear producto." });
    }
  }
);

// PATCH producto
app.patch("/api/productos/:id", authenticateToken, upload.single("img_producto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } = req.body;

    const updates = [];
    const values = [];
    let index = 1;

    if (nombre_producto) { updates.push(`nombre_producto=$${index++}`); values.push(nombre_producto); }
    if (precio_unitario) { updates.push(`precio_unitario=$${index++}`); values.push(parseFloat(precio_unitario)); }
    if (precio_x_mayor) { updates.push(`precio_x_mayor=$${index++}`); values.push(parseFloat(precio_x_mayor)); }
    if (desc_breve) { updates.push(`desc_breve=$${index++}`); values.push(desc_breve); }

    if (req.file) {
      const uploadResult = await uploadToS3(req.file.buffer, `${Date.now()}-update.jpg`);
      updates.push(`img_producto=$${index++}`);
      values.push(uploadResult.Location);
    }

    if (updates.length === 0) return res.status(400).json({ message: "No hay campos para actualizar." });

    const query = `UPDATE producto SET ${updates.join(", ")} WHERE id=$${index} RETURNING *;`;
    values.push(id);
    const result = await pool.query(query, values);
    io.emit("productoActualizado", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
});

// DELETE producto
app.delete("/api/productos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM producto WHERE id=$1;", [id]);
    io.emit("productoEliminado", { id });
    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar producto." });
  }
});

// Servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
