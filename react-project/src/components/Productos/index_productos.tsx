import { useEffect, useState } from "react";
import axios from "axios";
import "./styles_productos.css";
import io from "socket.io-client";

// Definir la interfaz para el producto
interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: number;
  precio_x_mayor: number;
  img_producto: string; // Aquí está el nombre de la imagen, no la cadena Base64
}

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 30;

  useEffect(() => {
    // Conectar a WebSocket para recibir nuevos productos
    const socket = io("https://mi-subdominio-unico.loca.lt");

    // Escuchar el evento 'nuevoProducto' y agregar el nuevo producto al estado
    socket.on("nuevoProducto", (nuevoProducto: Producto) => {
      setProductos(prevProductos => [...prevProductos, nuevoProducto]);
    });

    // Obtener los productos iniciales desde el servidor
    axios.get("https://mi-subdominio-unico.loca.lt/api/productos")
      .then(response => {
        console.log("Datos recibidos:", response.data);
        setProductos(response.data); // Ahora TypeScript no dará errores
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
      });

    // Limpiar la conexión del WebSocket cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  // const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const productosMostrados = productos.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // const cambiarPagina = (nuevaPagina: number) => {
  //   if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
  //     setPaginaActual(nuevaPagina);
  //   }
  // };

  return (
    <>
      <div id="productos-content">
        {productosMostrados.length > 0 ? (
          productosMostrados.map((producto) => (
            <div key={producto.id_producto} className="card" id="card-producto">
              
              {/* Cambiar a la URL de la imagen en el servidor */}
              <img
                src={`https://mi-subdominio-unico.loca.lt/${producto.img_producto}`} // Acceder a la imagen desde la carpeta uploads
                className="card-img-top"
                alt={producto.nombre_producto}
              />

              <h6 className="card-title">{producto.nombre_producto}</h6>
              
              <span>${Math.trunc(producto.precio_unitario)} c/u</span>
              
            </div>
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
      {/* <div className="paginacion">
        <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
          Siguiente
        </button>
      </div> */}
    </>
  );
}

export default Productos;
