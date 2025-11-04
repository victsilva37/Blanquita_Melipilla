require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
// require("tslib");


const app = express();

// --- CONFIGURACIONES BÁSICAS ---
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- IMPORTAR Y USAR RUTAS ---

//LOGIN_AUTH
const authRoutes = require("./endpoints/login_auth");
app.use("/api", authRoutes);

//PRODUCTO
const productoRoutes = require("./endpoints/producto");
app.use("/api/productos", productoRoutes);


// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
