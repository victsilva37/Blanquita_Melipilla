
import Banner from "../components/Home/Banner/index_banner";
import Info from "../components/Home/Info/index_info";
import MainProductos from "../components/Home/MainProductos/index_productos";
import Menu from "../layouts/Menu/index_menu";

export default function Home(){

    return(
        <>
            {/* Layout: MENU */}
            <Menu/>

            {/* Component: BANNER */}
            <Banner/>

            {/* Component: INFO */}
            <Info/>

            {/* Component: MAIN-PRODUCTOS */}
            <MainProductos/>

        </>
        
    )
}