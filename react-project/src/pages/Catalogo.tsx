import ListaProductos from "../components/Catalogo/ListaProductos/index_list_pro"
import Menu from "../layouts/Menu/index_menu"

export default function Catalogo(){
    return(
        <>
            {/* LAYOUT: Menu */}
            <Menu/>
        
            {/* COMPONENT: ListaProductos */}
            <ListaProductos/>

        </>
       
    )
}