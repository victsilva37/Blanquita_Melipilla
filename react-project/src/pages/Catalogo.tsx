import { useState } from "react";
import ListaProductos from "../components/Catalogo/ListaProductos/index_list_pro"
import Menu from "../layouts/Menu/index_menu"
import SearchBar from "../components/Catalogo/SearchBar/index_search_bar";

export default function Catalogo(){
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    return(
        <>
            {/* LAYOUT: Menu */}
            <Menu/>

            {/* COMPONENT: SearchBar */}
            <SearchBar  setSearchTerm={setSearchTerm}/>
        
            {/* COMPONENT: ListaProductos */}
            <ListaProductos searchTerm={searchTerm}/>

        </>
       
    )
}