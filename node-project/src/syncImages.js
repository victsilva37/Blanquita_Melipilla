const fs = require('fs');
const path = require('path');
const pool = require('./database'); // Conexión a la base de datos

// Ruta absoluta para la carpeta 'uploads'
const uploadsDir = path.join(__dirname, 'uploads');

// Crear la carpeta 'uploads' si no existe
if (!fs.existsSync(uploadsDir)) {
  console.log('La carpeta "uploads" no existe. Creándola...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function syncImages() {
  try {
    // Obtener todas las imágenes referenciadas en la base de datos
    const query = 'SELECT img_producto FROM producto;';
    const result = await pool.query(query);

    const imagesInDb = result.rows.map((row) => row.img_producto);

    // Verificar cada imagen
    for (const imageName of imagesInDb) {
      const imagePath = path.join(uploadsDir, imageName);

      if (!fs.existsSync(imagePath)) {
        console.warn(`Falta la imagen: ${imageName}`);
        
        // Aquí puedes implementar lógica adicional:
        // 1. Intentar regenerar la imagen (si tienes acceso a los datos originales).
        // 2. Descargarla desde un almacenamiento externo (como S3 o similar).
        // 3. Registrar un error o notificar al administrador.
      } else {
        console.log(`Imagen encontrada: ${imageName}`);
      }
    }
  } catch (error) {
    console.error('Error al sincronizar imágenes:', error);
  }
}

// Ejecutar la sincronización
syncImages();
