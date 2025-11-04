// import { useEffect, useState } from "react";
// import Menu from "../layouts/Menu/Menu";
// import SearchProductos from "../components/Home/SearchProductos/index_sear_pro";
// import CatCompleto from "../components/Catalogo/cat-completo/index_cat_completo";
// import Footer from "../layouts/Footer/index_footer";
// import { useLocation } from "react-router-dom";

// export default function Catalogo(){

//     const location = useLocation();
//     const [terminoBusqueda, setTerminoBusqueda] = useState("");

//     // 🧠 Leer query param 'buscar'
//     useEffect(() => {
//       const params = new URLSearchParams(location.search);
//       const buscar = params.get("buscar") || "";
//       setTerminoBusqueda(buscar);
//     }, [location.search]);

//     const cancelarBusqueda = () => {
//       setTerminoBusqueda("");
//       // También podrías usar navigate("/") si deseas limpiar la URL
//     };
    
//     return ( 
//         <div>
//             {/* Layout: Menu */}
//             <Menu 
//                 onBuscar={setTerminoBusqueda}
//                 onCancelarBusqueda={cancelarBusqueda}
//             />

//             {/* Component: CatCompleto */}

//             <section id="catalogo">
//                 {terminoBusqueda ? (
//                     // Componente de búsqueda de productos
//                     <SearchProductos termino={terminoBusqueda} cancelarBusqueda={cancelarBusqueda} />
//                 ) : (
//                     // Componente de productos principales
//                     <CatCompleto />
//                 )}
//             </section>

//             {/* Layout: Footer */}
//             <Footer />

//         </div>
//     );
// }