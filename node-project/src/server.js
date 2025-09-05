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

// Servir frontend (React Vite / dist)
app.use(express.static(path.join(__dirname, "../../react-project/dist")));

// Catch-all: cualquier ruta que no sea /api
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../react-project/dist/index.html"));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
