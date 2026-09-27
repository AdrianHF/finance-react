/**
 * @file useIsMobile.js
 * @component useIsMobile
 * @description Hook personalizado que detecta si el ancho de la ventana es menor o igual a un breakpoint especificado.
 *
 * Funcionalidades Clave:
 * - Evalúa el ancho del viewport en tiempo real mediante eventos de resize.
 * - Permite configurar un punto de quiebre (breakpoint) personalizado.
 * - Limpia los event listeners al desmontar el componente para evitar fugas de memoria.
 * - Retorna un valor booleano indicando si la vista actual es móvil.
 *
 * @returns {boolean} `true` si el ancho actual es menor o igual al breakpoint, de lo contrario `false`.
 */

import { useState, useEffect } from 'react';

/**
 * Custom Hook que detecta si el ancho de la ventana actual es menor o igual
 * a un punto de quiebre (breakpoint) en píxeles. Escucha eventos de `resize`
 * para actualizar el estado en tiempo real.
 *
 * @param {number} [breakpoint=768] - Ancho máximo en píxeles (px) para considerar la vista como móvil.
 * @returns {boolean} `true` si el viewport actual es menor o igual al breakpoint, de lo contrario `false`.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    /**
     * Evalúa el tamaño actual de la ventana y actualiza el estado.
     * @returns {void}
     */
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}