import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MenuProps {
  onBuscar: (termino: string) => void;
  onCancelarBusqueda: () => void;
}

export function useMenu({ onBuscar, onCancelarBusqueda }: MenuProps) {
   const [query, setQuery] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false); // 👈 Estado del menú hamburguesa
  const navigate = useNavigate();

  const handleBuscar = () => {
    const termino = query.trim();
    if (termino) {
      onBuscar(termino);
      navigate(`/?buscar=${encodeURIComponent(termino)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  const handleLogoClick = () => {
    setQuery("");
    onCancelarBusqueda();
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto); // 👈 Alternar visibilidad
  };

  return { query, setQuery, handleBuscar, handleKeyDown, handleLogoClick, menuAbierto, toggleMenu };
}