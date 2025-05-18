import { useEffect, useState } from "react";
import axios from "axios";
import "./styles_productos.css";
import io from "socket.io-client";
import { Producto } from "../../../interfaces/Producto";


const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export default function MainProductos() {

  
  /*------------------------------------------------------------------------------------
    ----------------------------Inicio LÓGICA-------------------------------------------
    ------------------------------------------------------------------------------------*/
    

    const [productos, setProductos] = useState<Producto[]>([]);
    const [paginaActual] = useState(1);
    const productosPorPagina = 30;

    useEffect(() => {
      // Conectar a WebSocket para recibir nuevos productos
      const socket = io("https://blanquitamelipillanode-production.up.railway.app");

      // Escuchar el evento 'nuevoProducto' y agregar el nuevo producto al estado
      socket.on("nuevoProducto", (nuevoProducto: Producto) => {
        setProductos(prevProductos => [...prevProductos, nuevoProducto]);
      });

        // Obtener los productos iniciales desde el servidor
        axios.get("https://blanquitamelipillanode-production.up.railway.app/api/productos",  {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
          })
        .then(response => {
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

    const productosMostrados = productos.slice(
      (paginaActual - 1) * productosPorPagina,
      paginaActual * productosPorPagina
    );
  /*------------------------------------------------------------------------------------
    ---------------------------- Fin LÓGICA---------------------------------------------
    ------------------------------------------------------------------------------------*/
//


  /*------------------------------------------------------------------------------------
    ------------------------------Inicio VISTA------------------------------------------
    ------------------------------------------------------------------------------------*/
    return (
      <>
        <div id="productos-content" >
          {productosMostrados.length > 0 ? (
            productosMostrados.slice(0,4).map((producto) => (
              <div key={producto.id_producto} className="card" id="card-producto">
                
                {/* img: Imagen  del producto en el servidor */}
                <img
                 // Acceder a la imagen desde la carpeta uploads
                  src={`https://blanquitamelipillanode-production.up.railway.app${producto.img_producto}`}
                  className="card-img-top"
                  alt={producto.nombre_producto}
                />
                
                {/* h6: Nombre del producto */}
                <h6 className="card-title">{producto.nombre_producto}</h6>
                
                {/* span: Precio unitario */}
                <span>${Math.trunc(producto.precio_unitario)} c/u</span>
                
              </div>
            ))
          ) : (
            <p>Cargando productos...</p>
          )}
        </div>
      </>
    );
   /*------------------------------------------------------------------------------------
    ------------------------------Fin VISTA----------------------------------------------
    ------------------------------------------------------------------------------------*/

}


