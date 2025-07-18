// func_sear_pro.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Producto } from "../../../interfaces/Producto";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useBusquedaProductos(termino: string) {
  const [productosMostrados, setProductosMostrados] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    if (!termino) return;

    axios
      .get(`${BACKEND_URL}/api/productos`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      })
      .then((res) => {
        const filtrados = res.data.filter((p: Producto) =>
          p.nombre_producto.toLowerCase().includes(termino.toLowerCase())
        );
        setProductosMostrados(filtrados);
      })
      .catch((err) => {
        console.error("Error al buscar productos:", err);
        setProductosMostrados([]);
      });
  }, [termino]);

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
  };

  return {
    productosMostrados,
    abrirModal,
    cerrarModal,
    productoSeleccionado,
  };
}
