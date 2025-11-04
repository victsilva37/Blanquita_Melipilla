import './stylesMenu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
// import icono_buscar from '../../assets/img/Menu/icono_buscar.png';
// import img2 from '../../assets/img/Menu/img2_inicio.png';
// import img3 from '../../assets/img/Menu/img3_catalogo.png';
import menu_hamburguesa from '../../assets/img/Menu/menu_hamburguesa.png';
import { Link } from 'react-router-dom';
import { useMenu } from './useMenu';



export default function Menu() {

  const {
    // query, setQuery,
    // handleBuscar, handleKeyDown,
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
          
          {/* Botón menú hamburguesa */}
            {/* Ícono menú hamburguesa */}
          <img
            className="menu-responsive"
            src={menu_hamburguesa}
            alt="Menú"
            onClick={toggleMenu}
          />


        {/*OPCIONES MENU*/}

            <ul id="menuNav" className={`menu-option ${menuAbierto ? "menu-active" : ""}`}>
                <li><a href="#inicio">INICIO</a></li>
                <li><a href="#catalogo">CATALOGO</a></li>
            </ul>


        </nav>
        
      </div>
    </div>
  );
}
