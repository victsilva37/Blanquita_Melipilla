// Footer.tsx
import "./styles_footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Blanquita Melipilla. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
