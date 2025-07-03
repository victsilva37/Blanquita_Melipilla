import "./styles_modal_pro.css";
import { Producto } from "../../../../interfaces/Producto";
import { useState, useEffect } from "react";


interface ModalProps {
  producto: Producto | null;
  cerrarModal: () => void;
}

export default function ModalProducto({ producto, cerrarModal }: ModalProps) {
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    setCantidad(1); // Reset cuando se abre modal
  }, [producto]);

  if (!producto) return null;



  const precioNeto = cantidad * producto.precio_unitario;
  const precioDesc = cantidad * producto.precio_x_mayor;

  return (
    <div id="modal-producto" className="show">
      <div className="modal-content">

        {/*BOTÓN DE CIERRE*/}

          <button 
            className="close-modal-btn" 
            onClick={cerrarModal}>×
          </button>



          

        {/* DESCRIPCIÓN DEL PRODUCTO SELECCIONADO */}

          <div id="info-producto">

            {/* Imagen del producto */}
            <img
                src={producto.img_producto}
                alt={producto.nombre_producto}
                className="modal-img"
              />

            {/* Información del producto */}
            <div>

              {/* Nombre del producto */}
              <h2>{producto.nombre_producto}</h2>


                {/* Cantidad del producto */}
                <div className="cantidad-container">

                    <label>Cantidad:</label>

                    {/* Botón prev */}
                    <button
                    onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                    >-</button>

                    {/* Input de cantidad */}
                    <input
                    id="cantidad"
                    type="number"
                    min={1}
                    value={cantidad}
                    readOnly
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setCantidad(value >= 1 ? value : 1);
                    }}
                    />

                    {/* Botón next */}
                    <button
                    onClick={() => setCantidad((prev) => prev + 1)}
                    >+</button>

                </div>
            </div>
          </div>
       

        <p>Precio unitario: ${producto.precio_unitario}</p>

        

        <p className="total">
          Precio total: <strong>${cantidad >= 500 ? precioDesc : precioNeto}</strong>
        </p>
      </div>
    </div>
  );
}
