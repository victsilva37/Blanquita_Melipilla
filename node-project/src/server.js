const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
require("dotenv").config();

const pool = require("./database");
const authenticateToken = require("./token");
const { uploadToS3 } = require("./s3Uploader");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middlewares
app.use(cors({ origin: "*", methods: ["GET","POST","PATCH","DELETE"], allowedHeaders: ["Authorization","Content-Type"] }));
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => { res.setHeader("Content-Type","application/json; charset=utf-8"); next(); });

// WebSockets
io.on("connection", socket => {
  console.log("Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
});

// Multer en memoria
const upload = multer({ storage: multer.memoryStorage() });

// =================== RUTAS ===================

// GET productos
app.get("/api/productos", authenticateToken, async (req,res)=>{
  try{
    const result = await pool.query("SELECT * FROM producto;");
    if(result.rows.length === 0) return res.status(404).json({ message: "No hay productos." });
    const productos = result.rows.map(p => ({ ...p, precio_total: p.precio_x_mayor && p.precio_x_mayor > 0 ? p.precio_x_mayor : p.precio_unitario }));
    res.status(200).json(productos);
  }catch(err){ console.error(err); res.status(500).json({ message: "Error al obtener productos." }); }
});

// POST productos con imagen
app.post("/api/productos", authenticateToken, upload.single("img_producto"), async (req,res)=>{
  try{
    const { nombre_producto, precio_unitario, precio_x_mayor, desc_breve } = req.body;
    if(!nombre_producto || !precio_unitario || !desc_breve || !req.file) 
      return res.status(400).json({ message: "Faltan campos obligatorios." });

    console.log("Archivo recibido:", req.file.originalname);

    const fileName = `${Date.now()}-${nombre_producto}.jpg`;
    const uploadResult = await uploadToS3(req.file.buffer, fileName);
    console.log("URL S3:", uploadResult.Location);

    const query = `
      INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, img_producto, desc_breve)
      VALUES ($1,$2,$3,$4,$5) RETURNING *;
    `;
    const values = [ nombre_producto, parseFloat(precio_unitario), precio_x_mayor?parseFloat(precio_x_mayor):null, uploadResult.Location, desc_breve ];

    const result = await pool.query(query, values);
    io.emit("productoCreado", result.rows[0]);
    res.status(201).json(result.rows[0]);
  }catch(err){
    console.error("ERROR creando producto:", err);
    res.status(500).json({ message: "Error al crear producto." });
  }
});

// PATCH productos
app.patch("/api/productos/:id", authenticateToken, async (req,res)=>{
  // Aquí puedes mantener tu lógica actual
});

// DELETE productos
app.delete("/api/productos/:id", authenticateToken, async (req,res)=>{
  // Aquí puedes mantener tu lógica actual
});

// Login
app.post("/api/login", async (req,res)=>{
  const { username,password } = req.body;
  if(username===process.env.USERNAME && password===process.env.PASSWORD){
    const token = require("jsonwebtoken").sign({username:"admin"}, process.env.JWT_SECRET, { expiresIn:"168h" });
    return res.status(200).json({ token });
  }
  res.status(401).json({ message:"Credenciales incorrectas" });
});

// Middleware de errores
app.use((err,req,res,next)=>{ console.error(err.stack); res.status(err.status||500).json({ message:err.message||"Error interno" }); });

// Servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT,"0.0.0.0",()=>console.log(`Servidor corriendo en puerto ${PORT}`));
