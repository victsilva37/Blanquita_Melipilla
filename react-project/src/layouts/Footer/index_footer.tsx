import './styles_footer.css'

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Blanquita Melipilla. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
