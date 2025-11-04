import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Producto } from "../../../interfaces/Producto";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useProductosCompletos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // 🔹 Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 15;

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("nuevoProducto", (nuevoProducto: Producto) => {
      setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
    });

    const fetchProductos = () => {
      axios
        .get(`${BACKEND_URL}/api/productos`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        })
        .then((response) => setProductos(response.data))
        .catch((error) => console.error("Error al obtener productos:", error));
    };

    fetchProductos();

    const intervalId = setInterval(fetchProductos, 5000);

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  // 🔹 Calcular productos para la página actual
  const indexOfLast = paginaActual * productosPorPagina;
  const indexOfFirst = indexOfLast - productosPorPagina;
  const productosMostrados = productos.slice(indexOfFirst, indexOfLast);

  // 🔹 Número total de páginas
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  // Modal handlers
  const abrirModal = (producto: Producto) => setProductoSeleccionado(producto);
  const cerrarModal = () => setProductoSeleccionado(null);

  return {
    productosMostrados,
    abrirModal,
    cerrarModal,
    productoSeleccionado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  };
}
