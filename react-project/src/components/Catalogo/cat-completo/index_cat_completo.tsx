import ModalProducto from "../../Home/MainProductos/modalProducto/index_modal_pro";
import { useProductosCompletos } from "./func_cat_completo";
import './styles_cat_completo.css'

export default function CatCompleto() {
    const { productosMostrados, abrirModal, cerrarModal, productoSeleccionado } = useProductosCompletos();
    return (
        <div>
            <h1>Catálogo Completo</h1>
            {/* Aquí puedes agregar el contenido del catálogo completo */}
            <div id="cat-completo-content">
                {productosMostrados.length > 0 ? (
                    productosMostrados.map((producto) => (
                        <div key={producto.id_producto} className="card" id="card-producto">

                            {/* Nombre del producto */}
                            <h4 className="card-title">{producto.nombre_producto}</h4>
                            
                            {/* Imagen del producto */}
                            <img
                                src={producto.img_producto}
                                className="card-img-top"
                                alt={producto.nombre_producto}
                            />

                            {/* Botón para ver detalle del producto */}
                            <button
                                disabled={producto.precio_unitario === 0}
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

                {productoSeleccionado && (
                    <ModalProducto producto={productoSeleccionado} cerrarModal={cerrarModal} />
                )}
            </div>
        </div>
    );
}