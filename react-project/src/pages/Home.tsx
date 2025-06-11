
import Banner from "../components/Home/Banner/index_banner";
import Info from "../components/Home/Info/index_info";
import MainProductos from "../components/Home/MainProductos/index_productos";
import Footer from "../layouts/Footer/index_footer";
import Menu from "../layouts/Menu/index_menu";

export default function Home(){

    return(
        <>
            {/* Layout: MENU */}
            <Menu/>

            <section id="inicio">
                {/* Component: BANNER */}
                <Banner/>

                {/* Component: INFO */}
                <Info/>
            </section>
                

            <section id="catalogo">
                {/* Component: MAIN-PRODUCTOS */}
                <MainProductos/>
            </section>

            {/* Layout: FOOTER */}
            <Footer/>
        </>   
    )
}