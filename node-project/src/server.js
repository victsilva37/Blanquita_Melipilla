require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();


// O si quieres permitir solo tu frontend:
app.use(cors({
  origin: "*"
}));

const productoRoutes = require("./endpoints/producto");
const authRoutes = require("./endpoints/login_auth");

app.use(express.json());
app.use("/api/productos", productoRoutes);
app.use("/api", authRoutes);

const path = require("path");

// Middleware para servir el frontend compilado
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all: para cualquier ruta que no sea /api
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
