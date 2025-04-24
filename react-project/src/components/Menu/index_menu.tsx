import './styles_menu.css'
import img1 from '../../assets/img/img1_logo_blanquita.png'
function Menu(){
    return(
        <div>
            <div id="menu-content">

                <img src={img1} alt="" />
                {/* <nav>
                    <ul>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#catalogo">Catálogo</a></li>
                        <li><a href="#contacto">Contacto</a></li>
                    </ul>
                </nav> */}
            </div>
        </div>
    )
}

export default Menu