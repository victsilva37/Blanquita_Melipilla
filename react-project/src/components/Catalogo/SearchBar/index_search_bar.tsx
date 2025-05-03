import { useState } from "react";
import './styles_search_bar.css'


interface MenuProps {
    setSearchTerm: (term: string) => void; // Función que actualiza el término de búsqueda
}
export default function SearchBar({ setSearchTerm }: MenuProps){

    const [searchInput, setSearchInput] = useState<string>("");
    
        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newSearchTerm = event.target.value;
            setSearchInput(newSearchTerm);
            setSearchTerm(newSearchTerm); // Actualizar el término de búsqueda en el estado del padre
        };

    return(
        <>
            <div id="buscador">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={searchInput}
                    onChange={handleSearchChange} // Actualizar el término de búsqueda
                />
            </div>
        </>
    )
}