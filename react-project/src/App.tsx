import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import Catalogo from './pages/Catalogo';

function App() {
  return (
    <Routes>

      {/* Ruta para la página de Home */}
      <Route path="/" element={<Home />} />

      {/* Ruta para la página de Catalogo */}
      {/* <Route path="/catalogo" element={<Catalogo />} /> */}
      
    </Routes>
  );
}

export default App;
