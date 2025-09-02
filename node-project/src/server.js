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

app.use(cors({ origin: "*", methods: ["GET","POST","PATCH","DELETE"], allowedHeaders: ["Authorization","Content-Type"] }));
app.use(express.json());
const upload = multer();

// WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

// GET productos
app.get("/api/productos", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto;");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener productos." });
  }
});

// POST producto con imagen
app.post("/api/productos", upload.single("img_producto"), async (req, res) => {
  try {
    const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } = req.body;
    if (!req.file || !nombre_producto || !precio_unitario || !desc_breve)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const fileName = `${Date.now()}-${nombre_producto}.jpg`;
    const uploadResult = await uploadToS3(req.file.buffer, fileName);

    const query = `
      INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, desc_breve, img_producto)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      nombre_producto,
      parseFloat(precio_unitario),
      precio_x_mayor ? parseFloat(precio_x_mayor) : null,
      desc_breve,
      uploadResult.Location,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ message: "Error al crear producto" });
  }
});

// PATCH producto
app.patch("/api/productos/:id", authenticateToken, upload.single("img_producto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;

    if (nombre_producto) { fields.push(`nombre_producto=$${idx++}`); values.push(nombre_producto); }
    if (precio_unitario) { fields.push(`precio_unitario=$${idx++}`); values.push(parseFloat(precio_unitario)); }
    if (precio_x_mayor) { fields.push(`precio_x_mayor=$${idx++}`); values.push(parseFloat(precio_x_mayor)); }
    if (desc_breve) { fields.push(`desc_breve=$${idx++}`); values.push(desc_breve); }
    if (req.file) {
      const fileName = `${Date.now()}-${nombre_producto || "producto"}.jpg`;
      const uploadResult = await uploadToS3(req.file.buffer, fileName);
      fields.push(`img_producto=$${idx++}`);
      values.push(uploadResult.Location);
    }

    if (!fields.length) return res.status(400).json({ message: "No hay campos para actualizar." });

    const query = `UPDATE producto SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *;`;
    values.push(id);

    const result = await pool.query(query, values);
    io.emit("productoActualizado", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
});

// DELETE producto
app.delete("/api/productos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM producto WHERE id=$1;", [id]);
    io.emit("productoEliminado", { id });
    res.status(200).json({ message: "Producto eliminado." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar producto." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    const token = require("jsonwebtoken").sign({ username }, process.env.JWT_SECRET, { expiresIn: "168h" });
    return res.status(200).json({ token });
  }
  res.status(401).json({ message: "Credenciales incorrectas." });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
