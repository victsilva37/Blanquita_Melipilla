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
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 30;

  useEffect(() => {
    axios.get("https://blanquitamelipilla-production.up.railway.app/api/productos")
      .then(response => {
        console.log("Datos recibidos:", response.data); 
        setProductos(response.data); // Ahora TypeScript no dará errores
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const productosMostrados = productos.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <>
      <div id="productos-content">
        {productosMostrados.length > 0 ? ( // ✅ Ya no dará error porque `productos` tiene un tipo definido
          productosMostrados.map((producto) => (
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
      <div className="paginacion">
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>
      </div>
    </>
   
  );
}

export default Productos;
