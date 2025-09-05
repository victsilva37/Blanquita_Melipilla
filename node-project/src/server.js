require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routers API
const productoRoutes = require("./endpoints/producto");
const authRoutes = require("./endpoints/login_auth");

app.use("/api/productos", productoRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
