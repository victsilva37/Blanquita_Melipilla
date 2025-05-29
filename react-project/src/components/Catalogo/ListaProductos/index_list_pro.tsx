import axios from "axios";
import { Producto } from "../../../interfaces/Producto";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import './styles_list_pro.css'

// Definir las props que espera ListaProductos
interface ListaProductosProps {
    searchTerm: string; // Prop para el término de búsqueda
}

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const FRONT_URL = import.meta.env.FRONTEND_URL;


export default function ListaProductos({ searchTerm }: ListaProductosProps) {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 30;

    useEffect(() => {
        // Conectar a WebSocket para recibir nuevos productos
        const socket = io(FRONT_URL);

        // Escuchar el evento 'nuevoProducto' y agregar el nuevo producto al estado
        socket.on("nuevoProducto", (nuevoProducto: Producto) => {
            setProductos(prevProductos => [...prevProductos, nuevoProducto]);
        });

        // Obtener los productos iniciales desde el servidor
        axios.get("https://blanquitamelipillanode-production.up.railway.app/api/productos", {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
          })
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

    // Filtrar los productos según el término de búsqueda
    const productosFiltrados = productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productosMostrados = productosFiltrados.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
    );

    // Calcular total de páginas
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    // Manejar el cambio de página
    const cambiarPagina = (nuevaPagina: number) => {
        if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    // 2. INTERFAZ DE USUARIO
    return (
        <>
            <div id="list-productos-content">
                {productosMostrados.length > 0 ? (
                    productosMostrados.map((producto) => (
                        <div key={producto.id_producto} className="card" id="card-list-productos">

                            {/* Cambiar a la URL de la imagen en el servidor */}
                            <img
                                src={`${producto.img_producto.startsWith("http") 
                                        ? producto.img_producto 
                                        : `https://blanquitamelipillanode-production.up.railway.app/uploads/${producto.img_producto}`}`}
                                className="card-img-top"
                                id="img_productos-tag"
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

            {/* Mostrar paginación solo si hay más de 30 productos */}
            {productosFiltrados.length > productosPorPagina && (
                <div className="paginacion">

                    <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
                    <span>Página {paginaActual} de {totalPaginas}</span>

                    <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>

                </div>
            )}
        </>
    )
}
