import "./styles_productos.css";
import { useProductos } from "./func_productos";

export default function MainProductos() {
  const { productosMostrados } = useProductos();

  console.log("Productos:", productosMostrados);

  return (
    <div id="productos-content">
      {productosMostrados.length > 0 ? (
        productosMostrados.map((producto, index) => (
          <div
            key={producto.id_producto ?? index} // fallback en caso de no tener id_producto
            className="card"
            id="card-producto"
          >
            <img
              src={producto.img_producto}
              className="card-img-top"
              alt={producto.nombre_producto}
            />
            <h4 className="card-title">{producto.nombre_producto}</h4>
            <p>Paquetes de {producto.cantidad_por_paquete} unidades</p>
          </div>
        ))
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
}

