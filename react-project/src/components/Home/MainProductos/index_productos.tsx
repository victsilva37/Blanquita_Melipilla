import "./styles_productos.css";
import { useProductos } from "./func_productos";
import ModalProducto from "./modalProducto/index_modal_pro";


export default function MainProductos() {
  const { productosMostrados, abrirModal, cerrarModal, productoSeleccionado } = useProductos();


  return (

    <div id="productos-container" className="container">

        <h1>¡Descubre las últimas tendencias!</h1>

        <div id="productos-content">

          {productosMostrados.length > 0 ? (
            productosMostrados.slice(-4).map((producto) => (
              // Renderizar cada producto
              // Usar key para identificar cada elemento de la lista
              <div key={producto.id_producto} className="card" id="card-producto">

                {/* NOMBRE DEL PRODUCTO */}

                  <h4 className="card-title">{producto.nombre_producto}</h4>
                  

                {/* IMAGEN DEL PRODUCTO */}

                  <img
                    src={producto.img_producto}
                    className="card-img-top"
                    alt={producto.nombre_producto}
                  />

                {/* BOTÓN VER DETALLE */}

                    <button
                    disabled={producto.precio_unitario == 0}
                    className="btn btn-primary"
                    onClick={() => abrirModal(producto)}
                    >
                    VER DETALLE
                    </button>

              </div>
            ))
          ) : (
            <p>Cargando productos...</p>
          )}

          {/* Component: MODAL-PRODUCTO */}

            {productoSeleccionado && (
              <ModalProducto producto={productoSeleccionado} cerrarModal={cerrarModal} />
            )}

        </div>
    </div>
    
  );
}
