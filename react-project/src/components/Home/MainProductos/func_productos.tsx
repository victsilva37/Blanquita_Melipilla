import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Producto } from "../../../interfaces/Producto";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const FRONT_URL = import.meta.env.FRONTEND_URL;

export function useProductos() {
    
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [paginaActual] = useState(1);
  const productosPorPagina = 30;

  // NOMBRE DEL PRODUCTO

    useEffect(() => {
      // Conectar a WebSocket para recibir nuevos productos
      const socket = io(FRONT_URL);

      // Escuchar el evento 'nuevoProducto' y agregar el nuevo producto al estado
      socket.on("nuevoProducto", (nuevoProducto: Producto) => {
        setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
      });
      
      // Obtener los productos iniciales desde el servidor
      axios
        .get("https://backend-node-wfhw.onrender.com/api/productos", {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        })
        .then((response) => {
          setProductos(response.data); // Ahora TypeScript no dará errores
        })
        .catch((error) => {
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


  //BOTON VER DETALLE
 
     const abrirModal = (producto: Producto) => {
      setProductoSeleccionado(producto);
    };

    const cerrarModal = () => {
      setProductoSeleccionado(null);
    };

    
  return { productosMostrados, abrirModal, cerrarModal, productoSeleccionado};
}
