import Banner from "./components/Banner/index_banner";
// import Contacto from "./components/Contacto/index_contacto";
// import Footer from "./components/Footer/index_footer";
// import Info from "./components/Info/index_info";
import Menu from "./components/Menu/index_menu";
import Productos from "./components/Productos/index_productos";



function App() {
  return (
    <>
      <Menu/>
      <main>
        <section id="inicio">
          <Banner/>
          {/* <Info/> */}
        </section>
        <section id="catalogo">
          <Productos />
        </section>

        {/* <section id="contacto">
          <Contacto />
        </section>

        <Footer /> */}
      </main>
    </>
    
  )
}

export default App;