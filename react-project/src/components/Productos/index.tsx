import { useEffect, useState } from "react";
import axios from "axios";
import "./productos.css";

// Definir la interfaz para el producto
interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: number;
  precio_x_mayor: number;
  img_producto: string;
}

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]); // ✅ Ahora TypeScript sabe qué estructura tiene el array

  useEffect(() => {
    axios.get("http://localhost:5000/api/productos")
      .then(response => {
        console.log("Datos recibidos:", response.data); 
        setProductos(response.data); // Ahora TypeScript no dará errores
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  return (
    <div id="productos-content">
      {productos.length > 0 ? ( // ✅ Ya no dará error porque `productos` tiene un tipo definido
        productos.map((producto) => (
          <div key={producto.id_producto} className="card">
            <h6 className="card-title">{producto.nombre_producto}</h6>
            <img src={`/assets/${producto.img_producto}`} className="card-img-top" alt={producto.nombre_producto} />
            <div className="card-body">
              <h6 className="card-text">${producto.precio_unitario} c/u</h6>
            </div>
          </div>
        ))
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
}

export default Productos;
