import './styles_menu.css';
import img1 from '../../assets/img/Menu/img1_logo_blanquita.png';
import img2 from '../../assets/img/Menu/img2_inicio.png';
import img3 from '../../assets/img/Menu/img3_catalogo.png';

import { Link } from 'react-router-dom';


export default function Menu() {
 
    return (
        <div>
            <div id="menu-content">

                {/* LOGO BLANQUITA */}

                    <img src={img1} alt="" />


                {/* NAVBAR */}

                    <nav>

                        {/* OPCIÓN INICIO */}

                            <div id="section-inicio">
                                <img src={img2} alt="" />
                                <Link to="/">INICIO</Link>
                            </div>


                        {/* OPCIÓN CATÁLOGO */}

                            <div id="section-catalogo">
                                <img src={img3} alt="" />
                                <Link to="/catalogo">CATÁLOGO</Link>
                            </div>

                    </nav>
            </div>
        </div>
    );
}


