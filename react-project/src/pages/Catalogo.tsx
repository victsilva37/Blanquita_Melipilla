import { useState } from "react";
import ListaProductos from "../components/Catalogo/ListaProductos/index_list_pro"
import Menu from "../layouts/Menu/index_menu"

export default function Catalogo(){
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    return(
        <>
            {/* LAYOUT: Menu */}
            <Menu setSearchTerm={setSearchTerm}/>
        
            {/* COMPONENT: ListaProductos */}
            <ListaProductos searchTerm={searchTerm}/>

        </>
       
    )
}