// src/hooks/useIsMobile.js
import { useState, useEffect } from 'react';

/**
 * Detecta si el viewport actual es "móvil" (<= breakpoint) y se actualiza
 * en tiempo real al hacer resize. Se extrajo del componente App porque
 * es una pieza de lógica totalmente independiente del negocio (no sabe
 * nada de productos, transacciones, etc.) y así puede reutilizarse en
 * cualquier otro componente sin arrastrar el resto de App.
 *
 * @param {number} breakpoint - ancho en px a partir del cual se considera móvil.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
