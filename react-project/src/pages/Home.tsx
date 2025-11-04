// pages/Home.tsx
// import { useEffect, useState } from "react";
import CatCompleto from "../components/Catalogo/cat-completo/CatCompleto";
import Banner from "../components/Home/Banner/index_banner";
// import MainProductos from "../components/Home/MainProductos/index_productos";
// import SearchProductos from "../components/Home/SearchProductos/index_sear_pro";
import Footer from "../layouts/Footer/index_footer";
import Menu from "../layouts/Menu/Menu";
// import { useLocation } from "react-router-dom";

export default function Home() {

    // const location = useLocation();
    // const [terminoBusqueda, setTerminoBusqueda] = useState("");

    // // 🧠 Leer query param 'buscar'
    // useEffect(() => {
    //   const params = new URLSearchParams(location.search);
    //   const buscar = params.get("buscar") || "";
    //   setTerminoBusqueda(buscar);
    // }, [location.search]);

    // const cancelarBusqueda = () => {
    //   setTerminoBusqueda("");
    //   // También podrías usar navigate("/") si deseas limpiar la URL
    // };


  return (
    <>
        <>
          <Menu
            // onBuscar={(term) => setTerminoBusqueda(term)}
            // onCancelarBusqueda={cancelarBusqueda}
          />

          <section id="inicio">
            <Banner />
          </section>

          <section id="catalogo">
            <CatCompleto/>
          </section>

          {/* <section id="catalogo">
            {terminoBusqueda ? (
              <SearchProductos termino={terminoBusqueda} cancelarBusqueda={cancelarBusqueda} />
            ) : (
              <MainProductos />
            )}
          </section> */}

          <Footer/>
        </>
    </>
  );
}
