const express = require('express');
const path = require('path');
const cors = require('cors');
const sharp = require('sharp'); // Para procesar imágenes
const http = require('http');
const fs = require('fs'); // Para monitorear cambios en la carpeta 'uploads'
const socketIo = require('socket.io');
require('dotenv').config(); // Carga variables de entorno desde un archivo .env
const pool = require('./database'); // Conexión a la base de datos
const authenticateToken = require('./token');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware CORS para permitir solicitudes desde cualquier origen
// Middleware CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// Middleware JSON
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});


// Ruta absoluta para la carpeta "uploads"
const uploadsDir = path.join(__dirname, 'uploads');

// Crear la carpeta 'uploads' si no existe
if (!fs.existsSync(uploadsDir)) {
  console.log('La carpeta "uploads" no existe. Creándola...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir imágenes desde la carpeta "uploads"
app.use('/uploads', express.static(uploadsDir));

// Monitoreo de cambios en la carpeta 'uploads'
fs.watch(uploadsDir, (eventType, filename) => {
  if (filename) {
    console.log(`Cambio detectado en 'uploads': ${filename} (${eventType})`);
    io.emit('uploadsUpdated', { filename, eventType });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});


// Rutas protegidas y públicas
app.get('/api/productos', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM producto;';
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No hay productos disponibles.' });
    }

    const productos = result.rows.map((producto) => ({
      ...producto,
      img_producto: `/uploads/${producto.img_producto}`,
      precio_total:
        producto.cantidad_por_paquete > 1
          ? producto.precio_unitario * producto.cantidad_por_paquete
          : producto.precio_unitario,
    }));

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los productos.' });
  }
});


app.post('/api/productos', authenticateToken, async (req, res) => {
  const {
    nombre_producto,
    precio_unitario,
    precio_x_mayor,
    img_producto,
    cantidad_por_paquete = 1,
    stock = 0,
  } = req.body;

  if (!nombre_producto || !precio_unitario || !img_producto) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const imgBuffer = Buffer.from(img_producto, 'base64');
    const imagenNombre = `${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, 'uploads', imagenNombre);

    await sharp(imgBuffer).resize(500).toFile(imagePath);

    const query = `
      INSERT INTO producto (nombre_producto, precio_unitario, precio_x_mayor, img_producto, cantidad_por_paquete, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      nombre_producto,
      parseFloat(precio_unitario),
      parseFloat(precio_x_mayor || 0),
      imagenNombre,
      parseInt(cantidad_por_paquete),
      parseInt(stock),
    ];

    const result = await pool.query(query, values);
    io.emit('nuevoProducto', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    res.status(500).json({ message: 'Error del servidor al guardar el producto.' });
  }
});


app.patch('/api/productos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nombre_producto, precio_unitario, precio_x_mayor, cantidad_por_paquete, stock } = req.body;

  const fieldsToUpdate = [];
  const values = [];
  let queryIndex = 1;

  if (nombre_producto) {
    fieldsToUpdate.push(`nombre_producto = $${queryIndex}`);
    values.push(nombre_producto);
    queryIndex++;
  }
  if (precio_unitario !== undefined) {
    fieldsToUpdate.push(`precio_unitario = $${queryIndex}`);
    values.push(parseFloat(precio_unitario));
    queryIndex++;
  }
  if (precio_x_mayor !== undefined) {
    fieldsToUpdate.push(`precio_x_mayor = $${queryIndex}`);
    values.push(parseFloat(precio_x_mayor));
    queryIndex++;
  }
  if (cantidad_por_paquete !== undefined) {
    fieldsToUpdate.push(`cantidad_por_paquete = $${queryIndex}`);
    values.push(parseInt(cantidad_por_paquete));
    queryIndex++;
  }
  if (stock !== undefined) {
    fieldsToUpdate.push(`stock = $${queryIndex}`);
    values.push(parseInt(stock));
    queryIndex++;
  }

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
  }

  const updateQuery = `
    UPDATE producto
    SET ${fieldsToUpdate.join(', ')}
    WHERE id = $${queryIndex}
    RETURNING *;
  `;
  values.push(id);

  try {
    const result = await pool.query(updateQuery, values);
    io.emit('productoActualizado', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el producto.' });
  }
});



app.delete('/api/productos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el producto existe
    const productoExistente = await pool.query('SELECT * FROM producto WHERE id = $1;', [id]);
    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Eliminar el producto
    await pool.query('DELETE FROM producto WHERE id = $1;', [id]);

    // Emitir evento para notificar la eliminación si usas sockets
    io.emit('productoEliminado', { id });

    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar el producto.' });
  }
});



app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Simulación de autenticación: reemplaza esto con la lógica de tu base de datos
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    const user = { username: 'admin' };
    const token = require('jsonwebtoken').sign(user, process.env.JWT_SECRET, {
      expiresIn: '168h',
    });
    return res.status(200).json({ token });
  }

  res.status(401).json({ message: 'Credenciales incorrectas.' });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor.' });
});

// Configuración del servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
