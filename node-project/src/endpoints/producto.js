const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { uploadFileToBucket } = require("../config/storage");
const authenticateToken = require("./login_auth");
const multer = require("multer");

// Configurar multer en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Crear producto ---
router.post("/", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;
    const fileUrl = req.file ? await uploadFileToBucket(req.file) : null;

    const { data, error } = await supabase
      .from("producto")
      .insert([
        {
          nombre_producto,
          precio_unitario,
          precio_x_mayor: precio_por_mayor,
          stock,
          img_producto: fileUrl
        }
      ])
      .select("*");

    if (error) throw error;

    res.json({ message: "Producto insertado correctamente", producto: data[0] });
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).json({ error: "Error al insertar producto" });
  }
});

// --- Obtener todos los productos ---
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// --- Actualizar producto ---
router.put("/:id", authenticateToken, upload.single("imagen_producto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, precio_unitario, precio_por_mayor, stock } = req.body;

    const fileUrl = req.file ? await uploadFileToBucket(req.file) : null;

    const updateData = {
      nombre_producto,
      precio_unitario,
      precio_x_mayor: precio_por_mayor,
      stock
    };

    if (fileUrl) updateData.img_producto = fileUrl;

    const { data, error } = await supabase
      .from("producto")
      .update(updateData)
      .eq("id", id)
      .select("*");

    if (error) throw error;
    if (!data.length) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado correctamente", producto: data[0] });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// --- Eliminar producto ---
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("producto").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
