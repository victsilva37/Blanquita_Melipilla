require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS
const corsOptions = {
  origin: ['https://blanquitamelipilla-production.up.railway.app'],  // Permite CORS desde ambos dominios
};

app.use(cors(corsOptions));

app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Esto es necesario si usas Railway o un servicio que requiere SSL
  },
});

// Ruta para obtener productos
app.get("/api/productos", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM productos"); // Asegurar que la tabla se llama "productos"
      console.log("Productos enviados:", result.rows); // 🔍 Verifica en la consola qué devuelve
      res.json(result.rows);
    } catch (error) {
      console.error("Error en la API:", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });
  

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
