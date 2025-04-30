import './styles_menu.css';
import img1 from '../../assets/img/img1_logo_blanquita.png';
import img2 from '../../assets/img/img2_logo_catalogo.png';
// import img3 from '../../assets/img/img3_logo_search.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Definir el tipo para las props del componente Menu
interface MenuProps {
    setSearchTerm: (term: string) => void; // Función que actualiza el término de búsqueda
}

function Menu({ setSearchTerm }: MenuProps) {
    const [searchInput, setSearchInput] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchInput(newSearchTerm);
        setSearchTerm(newSearchTerm); // Actualizar el término de búsqueda en el estado del padre
    };

    return (
        <div>
            <div id="menu-content">
                <Link to="/"><img src={img1} alt="" /></Link>
                <nav>
                    <div id="buscador">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar"
                            value={searchInput}
                            onChange={handleSearchChange} // Actualizar el término de búsqueda
                        />
                    </div>

                    <div id="section-catalogo">
                        <img src={img2} alt="" />
                        <Link to="/catalogo">CATÁLOGO</Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Menu;
