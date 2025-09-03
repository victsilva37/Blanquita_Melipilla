//IMPORTACIONES Y CONSTANTES
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Importar la función para subir archivos a S3
const { uploadFileToS3 } = require("../config/aws_S3");
// Importar el middleware de autenticación
const authenticateToken = require("./login_auth");

// Middleware para manejar la subida de archivos
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Crear producto
router.post("/", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const fileUrl = await uploadFileToS3(req.file);
    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;

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

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Actualizar producto
router.put("/:id", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const { id } = req.params;
    let fileUrl = null;

    if (req.file) {
      fileUrl = await uploadFileToS3(req.file);
    }

    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;

    const result = await pool.query(
      `UPDATE producto 
       SET nombre_producto=$1, precio_unitario=$2, precio_x_mayor=$3, stock=$4, 
           img_producto=COALESCE($5, img_producto)
       WHERE id=$6 RETURNING *`,
      [nombre_producto, precio_unitario, precio_por_mayor, stock, fileUrl, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado correctamente", producto: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM producto WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
