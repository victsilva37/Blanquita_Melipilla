// import ModalProducto from "../../Home/MainProductos/modalProducto/index_modal_pro";
import { useProductosCompletos } from "./useCatCompleto";
import './stylesCatCompleto.css'

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CatCompleto() {
    const {
    productosMostrados,
    // abrirModal,
    // cerrarModal,
    // productoSeleccionado,
    paginaActual,
    setPaginaActual,
    totalPaginas,
  } = useProductosCompletos();
    return (
        <div>

          
            {/*TITULO DE LA SECCIÓN*/}

            <h1>Catálogo</h1>

            {/* Aquí puedes agregar el contenido del catálogo completo */}
            <div id="cat-completo-content">
              
                {productosMostrados.length > 0 ? (
                    productosMostrados.map((producto) => (
                        <div key={producto.id_producto} className="card" id="card-producto">

                            {/* Nombre del producto */}
                            <h4 className="card-title">{producto.nombre_producto}</h4>
                            
                            {/* Imagen del producto */}
                            <img
                                src={`${producto.img_producto}`}
                                className="card-img-top"
                                alt={producto.nombre_producto}
                            />

                            {/* Precio unitario */}
                            <h5>$ <strong> {Math.round(producto.precio_unitario)}</strong> c/u</h5>

                        </div>
                    ))
                ) : (
                    <p>Cargando productos...</p>
                )}

                {/* {productoSeleccionado && (
                    <ModalProducto producto={productoSeleccionado} cerrarModal={cerrarModal} />
                )} */}

                
            </div>

            {/*PAGINATION*/}

              <div className="pagination">
                <button
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  ◀ Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaActual(i + 1)}
                    className={paginaActual === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente ▶
                </button>
              </div>
        </div>
    );
}