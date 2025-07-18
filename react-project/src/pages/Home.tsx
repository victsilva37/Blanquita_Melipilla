// pages/Home.tsx
import { useState } from "react";
import Banner from "../components/Home/Banner/index_banner";
import MainProductos from "../components/Home/MainProductos/index_productos";
import SearchProductos from "../components/Home/SearchProductos/index_sear_pro";
import Footer from "../layouts/Footer/index_footer";
import Menu from "../layouts/Menu/index_menu";

export default function Home() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const cancelarBusqueda = () => setTerminoBusqueda("");

  return (
    <>
      <Menu
        onBuscar={setTerminoBusqueda}
        onCancelarBusqueda={cancelarBusqueda}
      />

      <section id="inicio">
        <Banner />
      </section>

      <section id="catalogo">
        {terminoBusqueda ? (
          <SearchProductos termino={terminoBusqueda} cancelarBusqueda={cancelarBusqueda} />
        ) : (
          <MainProductos />
        )}
      </section>

      <Footer />
    </>
  );
}
