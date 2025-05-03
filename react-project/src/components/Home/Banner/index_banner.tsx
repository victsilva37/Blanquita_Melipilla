import './styles_banner.css'
import img1 from '../../../assets/img/Banner/img1_portada.png'
import img2 from '../../../assets/img/Banner/img2_banner.png'

export default function Banner(){
    return(
        <>
            <div id="banner-content" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">

                    {/* Imagen 1 */}
                    <div className="carousel-item active">
                        <img src={img1} alt="Producto" />
                    </div>

                    {/* Imagen 2 */}
                    <div className="carousel-item">
                        <img src={img2} alt="Producto" />
                    </div>
                    
                </div>
            </div>
        </>
    )
}

