import img3 from '../../assets/img/img3_logo_inicio_1.png';
import img4 from '../../assets/img/img4_logo_inicio_2.png';
import img5 from '../../assets/img/img5_logo_inicio_3.png';
import './info.css'

function Info(){
    return(
        <>
         <div id='card'>
            <div className="card-body">
                <img src={img3} alt="" />
                <p>
                    <strong>
                    Ofrecemos envases y troquelados prácticos y resistentes, <br />
                    ideales para productos como papas fritas y pizzas individuales.
                    </strong>
                </p>
            </div>
            <div className="card-body">
                <img src={img4} alt="" />
                <p>
                    <strong>
                    Ofrecemos soluciones básicas en envases <br />
                    para negocios de comida rápida y delivery.
                    </strong>
                </p>
            </div>
            <div className="card-body">
                <img src={img5} alt="" />
                <p>
                    <strong>
                    Nuestros productos son ideales para almacenar <br />
                     y presentar alimentos de manera sencilla.
                    </strong>
                </p>
            </div>
        </div>
        </>
       
    )
}

export default Info;