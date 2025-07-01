import './styles_info.css'
import img1 from '../../../assets/img/Info/img1_logo_inicio_1.png';
import img2 from '../../../assets/img/Info/img2_logo_inicio_2.png';


export default function Info(){
    return(
        <>
         <div id='card-info'>

            {/* INFO 1 */}

                <div className="card-body">

                    {/* LOGO */}

                        <img src={img1} alt="" />


                    {/* TITULO */}

                        <p>
                            <strong>
                            Ofrecemos envases y troquelados prácticos y resistentes,<br />
                            ideales para productos como papas fritas y pizzas individuales.
                            </strong>
                        </p>

                </div>


            {/* INFO 2 */}

                <div className="card-body">

                    {/* LOGO */}

                        <img src={img2} alt="" />


                    {/* TITULO */}
                    
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

