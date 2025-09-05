require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS
app.use(cors({ origin: "*" }));

// Middlewares
app.use(express.json());

// Rutas API
const productoRoutes = require("./endpoints/producto");
const authRoutes = require("./endpoints/login_auth");
app.use("/api/productos", productoRoutes);
app.use("/api", authRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, "dist"))); // 👈 tu carpeta compilada de React

// Catch-all para React Router
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
