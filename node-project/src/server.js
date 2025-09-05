require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Permitir CORS para cualquier origen
app.use(cors({ origin: "*" }));

// Middleware para parsear JSON
app.use(express.json());

// Routers API
const productoRoutes = require("./endpoints/producto");
const authRoutes = require("./endpoints/login_auth");

app.use("/api/productos", productoRoutes);
app.use("/api", authRoutes);

// Servir React desde dist
const reactDistPath = path.join(__dirname, "../../react-project/dist");
app.use(express.static(reactDistPath));

// Redirigir todas las rutas que no sean /api/* al index.html
app.get("*", (req, res) => {
  // Si la ruta empieza con /api, no enviar index.html
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Ruta API no encontrada" });
  }

  res.sendFile(path.join(reactDistPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
