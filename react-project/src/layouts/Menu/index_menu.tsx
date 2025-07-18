import './styles_menu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
import icono_buscar from '../../assets/img/Menu/icono_buscar.png';
import { useState } from 'react';

interface MenuProps {
  onBuscar: (termino: string) => void;
  onCancelarBusqueda: () => void;
}

export default function Menu({ onBuscar, onCancelarBusqueda  }: MenuProps) {
  const [query, setQuery] = useState("");

  const handleBuscar = () => {
    if (query.trim()) {
      onBuscar(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  const handleLogoClick = () => {
    setQuery(""); // limpia el input
    onCancelarBusqueda(); // cancela la búsqueda
  };

  return (
    <div>
      <div id="menu-content">

        {/* LOGO BLANQUITA */}
        <img
          src={img1}
          alt="Logo Blanquita"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }} // cursor tipo botón
        />

        {/* NAVBAR */}
        <nav>
          {/* BUSCADOR */}
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
        </nav>
      </div>
    </div>
  );
}
