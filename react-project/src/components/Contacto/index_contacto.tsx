import img7 from '../../assets/img/img7_contacto.jpeg'
import icon1 from '../../assets/img/icon1_gmail.png'
import icon2 from '../../assets/img/icon2_whatsapp.png'
import './styles_contacto.css'
export default function Contacto(){
    return (
        <>
            <div id="card_contacto">
                <img src={img7} alt="" id='img_dueno' />
                <div id="contacto-container">
                    <h1>Contacto</h1>
                    <div id='gmail-content'>
                        <img src={icon1} alt="" id='icon1'/>
                        <h5>maurosilvilla2@gmail.com</h5>
                    </div>
                    <div id='wsp-content'>
                        <img src={icon2} alt="" id='icon2'/>
                        <h5>+56 9 7544 6807</h5>
                    </div>
                    
                </div>
            </div>
        </>
    )
}