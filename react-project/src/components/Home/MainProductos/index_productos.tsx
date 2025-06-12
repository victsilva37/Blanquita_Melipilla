import "./styles_productos.css";
import { useProductos } from "./func_productos";

export default function MainProductos() {
  const { productosMostrados } = useProductos();

  return (
    <div id="productos-content">
      {productosMostrados.length > 0 ? (
        productosMostrados.map((producto) => (
          <div key={producto.id_producto} className="card" id="card-producto">
            {/* Imagen del producto */}
            <img
              src={`https://backend-node-wfhw.onrender.com${producto.img_producto}`}
              className="card-img-top"
              alt={producto.nombre_producto}
            />
            {/* Nombre del producto */}
            <h4 className="card-title">{producto.nombre_producto}</h4>
            {/* Cantidad por paquete */}
            <p>Paquetes de {producto.cantidad_por_paquete} unidades</p>
            {/* Precio unitario */}
            {/* <span>
              ${Math.trunc(producto.precio_unitario * producto.cantidad_por_paquete)}
            </span> */}
            <button id="btnVerDetalle" className="btn btn-primary">VER DETALLE</button>
          </div>
        ))
      ) : (
        <p>Cargando productos...</p>
      )}
    </div>
  );
}
