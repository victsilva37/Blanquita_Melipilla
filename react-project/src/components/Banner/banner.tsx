import './banner.css'
// import img1 from '../../assets/img/aa.png'
import video1 from '../../assets/video/video1_banner.mp4'
import img2 from '../../assets/img/img2_banner.png'

function Banner(){
    return(
        <>
            <div id="banner-content" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <video src={video1} autoPlay muted loop playsInline></video>
                    </div>
                    <div className="carousel-item">
                        <img src={img2} alt="" />
                    </div>
                </div>
            </div> 
        </>
    )
}

export default Banner