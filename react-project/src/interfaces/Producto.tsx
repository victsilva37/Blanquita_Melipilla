// Definir la interfaz para el producto
export interface Producto {
    id_producto: number;
    nombre_producto: string;
    precio_unitario: number;
    precio_x_mayor: number;
    img_producto: string; // Aquí está el nombre de la imagen, no la cadena Base64
}