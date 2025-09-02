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
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// ================== WebSockets ==================
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// ================== Rutas ==================

// Obtener productos
app.get("/api/productos", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto;");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hay productos disponibles." });
    }
    const productos = result.rows.map((producto) => ({
      ...producto,
      img_producto: producto.img_producto,
      precio_total:
        producto.precio_x_mayor && producto.precio_x_mayor > 0
          ? producto.precio_x_mayor
          : producto.precio_unitario,
    }));
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al recuperar los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos." });
  }
});

// Crear producto
app.post("/api/productos", authenticateToken, async (req, res) => {
  const { nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve } = req.body;

  if (!nombre_producto || !precio_unitario || !img_producto || !desc_breve) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    const imgBuffer = Buffer.from(img_producto, "base64");
    const fileName = `${Date.now()}-${nombre_producto}.jpg`;
    const uploadResult = await uploadToS3(imgBuffer, fileName);

    const query = `
      INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre_producto, parseFloat(precio_unitario), precio_x_mayor ? parseFloat(precio_x_mayor) : null, uploadResult.Location, desc_breve];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ message: "Error al crear el producto." });
  }
});

// Actualizar producto
app.patch("/api/productos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve } = req.body;

  const fieldsToUpdate = [];
  const values = [];
  let queryIndex = 1;

  if (nombre_producto) {
    fieldsToUpdate.push(`nombre_producto = $${queryIndex}`);
    values.push(nombre_producto);
    queryIndex++;
  }
  if (precio_unitario !== undefined) {
    fieldsToUpdate.push(`precio_unitario = $${queryIndex}`);
    values.push(parseFloat(precio_unitario));
    queryIndex++;
  }
  if (precio_x_mayor !== undefined) {
    fieldsToUpdate.push(`precio_x_mayor = $${queryIndex}`);
    values.push(parseFloat(precio_x_mayor));
    queryIndex++;
  }
  if (desc_breve) {
    fieldsToUpdate.push(`desc_breve = $${queryIndex}`);
    values.push(desc_breve);
    queryIndex++;
  }
  if (img_producto) {
    // Si se envía nueva imagen, subir a S3
    const imgBuffer = Buffer.from(img_producto, "base64");
    const fileName = `${Date.now()}-${nombre_producto || "producto"}.jpg`;
    const uploadResult = await uploadToS3(imgBuffer, fileName);
    fieldsToUpdate.push(`img_producto = $${queryIndex}`);
    values.push(uploadResult.Location);
    queryIndex++;
  }

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ message: "No se proporcionaron campos para actualizar." });
  }

  const updateQuery = `
    UPDATE producto
    SET ${fieldsToUpdate.join(", ")}
    WHERE id = $${queryIndex}
    RETURNING *;
  `;
  values.push(id);

  try {
    const result = await pool.query(updateQuery, values);
    io.emit("productoActualizado", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error del servidor al actualizar el producto." });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const productoExistente = await pool.query("SELECT * FROM producto WHERE id = $1;", [id]);
    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    await pool.query("DELETE FROM producto WHERE id = $1;", [id]);
    io.emit("productoEliminado", { id });
    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    const user = { username: "admin" };
    const token = require("jsonwebtoken").sign(user, process.env.JWT_SECRET, { expiresIn: "168h" });
    return res.status(200).json({ token });
  }
  res.status(401).json({ message: "Credenciales incorrectas." });
});

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Error interno del servidor." });
});

// Servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
