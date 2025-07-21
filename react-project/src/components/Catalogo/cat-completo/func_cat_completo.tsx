import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Producto } from "../../../interfaces/Producto";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useProductosCompletos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [paginaActual] = useState(1);
  const productosPorPagina = 30;

  useEffect(() => {
    // Socket solo si es compatible (Render no siempre lo es)
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("nuevoProducto", (nuevoProducto: Producto) => {
      setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    });

    // Función para obtener productos desde la API
    const fetchProductos = () => {
      axios
        .get(`${BACKEND_URL}/api/productos`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        })
        .then((response) => {
          setProductos(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener productos:", error);
        });
    };

    // Llamada inicial
    fetchProductos();

    // Polling cada 5 segundos
    const intervalId = setInterval(fetchProductos, 5000);

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  // Calcular productos por página
  const productosMostrados = productos.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // Modal handlers
  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
  };

  return { productosMostrados, abrirModal, cerrarModal, productoSeleccionado };
}
