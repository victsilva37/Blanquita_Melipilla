import "./styles_productos.css";
import { useProductos } from "./func_productos";
import ModalProducto from "./modalProducto/index_modal_pro";


export default function MainProductos() {
  const { productosMostrados, cerrarModal, productoSeleccionado } = useProductos();


  return (

    <div id="productos-container" className="container">

        <h1>¡Descubre las últimas tendencias!</h1>

        <div id="productos-content">

          {productosMostrados.length > 0 ? (
            productosMostrados.slice(0,4).map((producto) => (
              <div key={producto.id_producto} className="card" id="card-producto">

                {/* IMAGEN DEL PRODUCTO */}

                  <img
                    src={`${producto.img_producto}`}
                    className="card-img-top"
                    alt={producto.nombre_producto}
                  />

                {/* NOMBRE DEL PRODUCTO */}

                  <h4 className="card-title">{producto.nombre_producto}</h4>
                  

                {/* BOTÓN VER DETALLE */}

                    {/* <button
                    disabled={producto.precio_unitario == 0}
                    className="btn btn-primary"
                    onClick={() => abrirModal(producto)}
                    >
                    VER DETALLE
      
                    </button> */}
                <h5>$ <strong> {Math.round(producto.precio_unitario)}</strong> c/u</h5>
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
