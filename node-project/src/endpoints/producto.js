// IMPORTACIONES Y CONSTANTES
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// const { uploadFileToS3 } = require("../config/aws_S3"); // ← Descomentar cuando uses AWS
const authenticateToken = require("./login_auth");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- CONFIGURAR UPLOAD LOCAL ---
const uploadDir = path.join(__dirname, "../uploads");

// Si la carpeta no existe, crearla automáticamente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para guardar en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// --- CREAR PRODUCTO ---
router.post("/", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;

    // Si hay imagen, construir la URL local
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, stock, img_producto) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre_producto, precio_unitario, precio_por_mayor, stock, fileUrl]
    );

    res.json({ message: "Producto insertado correctamente", producto: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).json({ error: "Error al insertar producto" });
  }
});

// --- OBTENER TODOS LOS PRODUCTOS ---
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// --- ACTUALIZAR PRODUCTO ---
router.put("/:id", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;

    let fileUrl = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE producto 
       SET nombre_producto=$1, precio_unitario=$2, precio_x_mayor=$3, stock=$4, 
           img_producto=COALESCE($5, img_producto)
       WHERE id=$6 RETURNING *`,
      [nombre_producto, precio_unitario, precio_por_mayor, stock, fileUrl, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado correctamente", producto: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// --- ELIMINAR PRODUCTO ---
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM producto WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
