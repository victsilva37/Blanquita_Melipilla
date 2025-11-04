//Importar CSS
import './stylesFooter.css'

//Importar imágenes
import logo_whatsapp from '../../assets/img/Footer/logo_whatsapp.png'

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <div id='contacto-content'>
              <p>Contacto: </p>
              
              <p id='p_number'><img src={logo_whatsapp} alt="Enviar correo a Víctor" /> +56 9 4050 0050</p> 
          </div>
          <p id="p_derechos-content">&copy; {new Date().getFullYear()} Blanquita Melipilla. Todos los derechos reservados.</p>
        </div>
         
      </footer>
    </>
  );
}
