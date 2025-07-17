import './styles_menu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
import icono_buscar from '../../assets/img/Menu/icono_buscar.png';

// import { Link } from 'react-router-dom';


export default function Menu() {
 
    return (
        <div>
            <div id="menu-content">

                {/* LOGO BLANQUITA */}

                    <img src={img1} alt="" />


                {/* NAVBAR */}

                    <nav>

                        {/*OPCIÓN BUSCADOR**/}

                            <div id="search-bar">
                                <input type="text" placeholder="Buscar..." />
                                <button><img src={icono_buscar} alt="" /></button>
                            </div>

                    </nav>
            </div>
        </div>
    );
}


