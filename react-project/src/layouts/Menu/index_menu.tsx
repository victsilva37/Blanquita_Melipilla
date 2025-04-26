import './styles_menu.css'
import img1 from '../../assets/img/img1_logo_blanquita.png'
import img2 from '../../assets/img/img2_logo_catalogo.png'
import img3 from '../../assets/img/img3_logo_search.png'
import { Link } from 'react-router-dom'
function Menu(){
    return(
        <div>
            <div id="menu-content">

                <Link to="/"><img src={img1} alt="" /></Link>
                <nav>

                    <div id='buscador'>
                        <input type="text" className='form-control' placeholder='Buscar'/>
                        <button className='btn btn-primary'><img src={img3} alt=""/></button>
                    </div> 

                    <div id='section-catalogo'>
                        <img src={img2} alt=""/>
                        <Link to="/catalogo">CATÁLOGO</Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Menu