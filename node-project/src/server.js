const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const pool = require("./database");
const authenticateToken = require("./token");
const { uploadToS3 } = require("./s3Uploader");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ================== Middlewares ==================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// ================== WebSockets ==================
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

// ================== Rutas ==================

// Obtener productos
app.get("/api/productos", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto;");
    if (result.rows.length === 0) return res.status(404).json({ message: "No hay productos." });

    const productos = result.rows.map((p) => ({
      ...p,
      precio_total: p.precio_x_mayor && p.precio_x_mayor > 0 ? p.precio_x_mayor : p.precio_unitario,
    }));

    res.status(200).json(productos);
  } catch (err) {
    console.error("Error al recuperar productos:", err);
    res.status(500).json({ message: "Error al obtener productos." });
  }
});

// Crear producto
app.post("/api/productos", authenticateToken, async (req, res) => {
  const { nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve } = req.body;

  if (!nombre_producto || !precio_unitario || !img_producto || !desc_breve) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    // Convertir base64 a Buffer
    const imgBuffer = Buffer.from(img_producto, "base64");
    const fileName = `${Date.now()}-${nombre_producto.replace(/\s/g, "_")}.jpg`;

    // Subir a S3
    const uploadResult = await uploadToS3(imgBuffer, fileName);

    // Guardar producto en BD con la URL de S3
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
      desc_breve
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ message: "Error al crear el producto." });
  }
});

// Actualizar producto
app.patch("/api/productos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (nombre_producto) { fields.push(`nombre_producto = $${idx}`); values.push(nombre_producto); idx++; }
  if (precio_unitario !== undefined) { fields.push(`precio_unitario = $${idx}`); values.push(parseFloat(precio_unitario)); idx++; }
  if (precio_x_mayor !== undefined) { fields.push(`precio_x_mayor = $${idx}`); values.push(parseFloat(precio_x_mayor)); idx++; }
  if (desc_breve) { fields.push(`desc_breve = $${idx}`); values.push(desc_breve); idx++; }
  if (img_producto) {
    const buffer = Buffer.from(img_producto, "base64");
    const fileName = `${Date.now()}-${nombre_producto || "producto"}.jpg`;
    const uploadResult = await uploadToS3(buffer, fileName);
    fields.push(`img_producto = $${idx}`);
    values.push(uploadResult.Location);
    idx++;
  }

  if (fields.length === 0) return res.status(400).json({ message: "No se proporcionaron campos a actualizar." });

  const query = `UPDATE producto SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    io.emit("productoActualizado", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const exist = await pool.query("SELECT * FROM producto WHERE id = $1;", [id]);
    if (exist.rows.length === 0) return res.status(404).json({ message: "Producto no encontrado." });

    await pool.query("DELETE FROM producto WHERE id = $1;", [id]);
    io.emit("productoEliminado", { id });
    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ message: "Error al eliminar producto." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    const token = require("jsonwebtoken").sign({ username: "admin" }, process.env.JWT_SECRET, { expiresIn: "168h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Credenciales incorrectas." });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Error interno del servidor." });
});

// Servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
