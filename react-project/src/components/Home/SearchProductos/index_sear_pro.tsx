// SearchProductos/index_sear_pro.tsx
import { useBusquedaProductos } from "./func_sear_pro";
import ModalProducto from "../MainProductos/modalProducto/index_modal_pro";
import "./styles_sear_pro.css";

interface SearchProductosProps {
  termino: string;
  cancelarBusqueda: () => void;
}

export default function SearchProductos({ termino }: SearchProductosProps) {
  const {
    productosMostrados,
    abrirModal,
    cerrarModal,
    productoSeleccionado,
  } = useBusquedaProductos(termino);


  return (
    <div id="search-productos-content">

        {/* Mostrar el título para la búsqueda */}
        <h1>Resultados de "{termino}"</h1>

        <div className="productos-lista">

            {/* Mostrar productos encontrados o mensaje si no hay resultados */}
            {productosMostrados.length === 0 ? (
            <p>No se encontraron productos.</p>
            ) : (
            productosMostrados.map((producto) => (
                <div className="producto-item"  key={producto.id_producto}>
                    <img src={producto.img_producto} alt={producto.nombre_producto} />
                    <h4>{producto.nombre_producto}</h4>
                    <button disabled className="btn btn-primary"
                        onClick={() => abrirModal(producto)}>VER DETALLE
                    </button>
                </div>
            ))
            )}
        </div>

      {productoSeleccionado && (
        <ModalProducto producto={productoSeleccionado} cerrarModal={cerrarModal} />
      )}
    </div>
  );
}
