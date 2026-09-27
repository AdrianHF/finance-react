/**
 * @file MobileNav.jsx
 * @component MobileNav
 * @description Barra de navegación inferior fija diseñada exclusivamente para dispositivos móviles.
 *
 * Funcionalidades Clave:
 * - Posicionamiento fijo en la parte inferior del viewport con sombra y elevación (zIndex).
 * - Renderizado dinámico de pestañas a partir de una configuración centralizada (MOBILE_TABS).
 * - Emisión de eventos al componente padre mediante un callback al seleccionar una pestaña.
 * - Sincronización visual del estado activo/inactivo en cada botón de navegación.
 *
 * @returns {JSX.Element} Barra de navegación fija inferior para móviles.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { mobileTabButtonStyle } from '../styles/styles';

/**
 * Configuración de las pestañas disponibles en la navegación móvil.
 * Contiene el identificador único de cada pestaña y su etiqueta visible.
 * 
 * @type {Array<{id: string, label: string}>}
 */
const MOBILE_TABS = [
  { id: 'dashboard', label: 'ADRIAN' },
  { id: 'transacciones', label: 'MARIE' },
  { id: 'ana', label: 'ANA' },
  { id: 'padre', label: 'PADRE' },
  { id: 'jefesita', label: 'JEFESITA' },
];

/**
 * Componente de barra de navegación inferior (Bottom Navigation Bar).
 * 
 * Diseñado exclusivamente para dispositivos móviles. Se posiciona de forma fija en la 
 * parte inferior del viewport (fixed bottom) y renderiza dinámicamente los botones de 
 * navegación a partir del arreglo `MOBILE_TABS`.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.activeTab - Identificador de la pestaña que se encuentra actualmente seleccionada.
 * @param {Function} props.onSelectTab - Callback que se dispara al hacer clic en un botón, recibiendo el `id` del tab.
 * 
 * @returns {JSX.Element} Barra de navegación fija inferior para móviles.
 */
export default function MobileNav({ activeTab, onSelectTab }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: '#465c73',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      {/* Iteración de pestañas para evitar redundancia de código */}
      {MOBILE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          style={mobileTabButtonStyle(activeTab === tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}