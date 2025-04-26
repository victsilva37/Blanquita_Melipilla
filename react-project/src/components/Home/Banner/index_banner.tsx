import './styles_banner.css'
import img1 from '../../../assets/img/img1_portada.png'
import img2 from '../../../assets/img/img2_banner.png'

export default function Banner(){
    return(
        <>
            <div id="banner-content" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        {/* <video src={video1} autoPlay muted loop playsInline></video> */}
                        <img src={img1} alt="Producto" />
                    </div>
                    <div className="carousel-item">
                        <img src={img2} alt="Producto" />
                    </div>
                </div>
            </div>
        </>
    )
}

