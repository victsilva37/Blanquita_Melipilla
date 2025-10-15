require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// --- CONFIGURACIONES BÁSICAS ---
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- SERVIR ARCHIVOS SUBIDOS LOCALMENTE ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- IMPORTAR Y USAR RUTAS ---
const productoRoutes = require("./endpoints/producto");
const authRoutes = require("./endpoints/login_auth");

app.use("/api/productos", productoRoutes);
app.use("/api", authRoutes);

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
