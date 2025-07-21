import './styles_menu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
import icono_buscar from '../../assets/img/Menu/icono_buscar.png';
import img3 from '../../assets/img/Menu/img3_catalogo.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface MenuProps {
  onBuscar: (termino: string) => void;
  onCancelarBusqueda: () => void;
}

export default function Menu({ onBuscar, onCancelarBusqueda  }: MenuProps) {

     const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Necesario para redirigir manualmente

  const handleBuscar = () => {
    const termino = query.trim();
    if (termino) {
      onBuscar(termino);                // Actualiza estado en App
      navigate(`/?buscar=${encodeURIComponent(termino)}`); // Redirige con query param
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  const handleLogoClick = () => {
    setQuery(""); 
    onCancelarBusqueda(); 
  };

  return (
    <div>
      <div id="menu-content">

        {/* LOGO */}
        <Link to="/">
          <img
            src={img1}
            alt="Logo Blanquita"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </Link>

        <nav>
          <div id="search-bar">
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleBuscar}>
              <img src={icono_buscar} alt="Buscar" />
            </button>
          </div>

          <div className="menu-option">
            <Link to="/catalogo">
              Catálogo
              <img src={img3} alt="Catálogo" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
