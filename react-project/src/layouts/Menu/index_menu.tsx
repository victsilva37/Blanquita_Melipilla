import './styles_menu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
import icono_buscar from '../../assets/img/Menu/icono_buscar.png';
import img3 from '../../assets/img/Menu/img3_catalogo.png';
import menu_hamburguesa from '../../assets/img/Menu/menu_hamburguesa.png';
import { Link } from 'react-router-dom';
import { useMenu } from './func_menu';



export default function Menu() {

  const {
    query, setQuery,
    handleBuscar, handleKeyDown,
    handleLogoClick, menuAbierto, toggleMenu // 👈 Importar nuevos estados
  } = useMenu({
    onBuscar: (termino) => console.log(`Buscando: ${termino}`),
    onCancelarBusqueda: () => console.log('Búsqueda cancelada'),
  });
  

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

         {/* Botón menú hamburguesa */}
          {/* Ícono menú hamburguesa */}
        <img
          className="menu-responsive"
          src={menu_hamburguesa}
          alt="Menú"
          onClick={toggleMenu}
        />

        {/* Opciones desplegables flotantes */}
        <div className={`menu-option ${menuAbierto ? "menu-active" : ""}`}>
          <Link to="/catalogo">
            <img src={img3} alt="Catálogo" /> 
            Catálogo 
          </Link>
        </div>


            
        </nav>
        
      </div>
    </div>
  );
}
