// src/components/MobileNav.jsx
import React from 'react';
import { mobileTabButtonStyle } from '../styles/styles';

const MOBILE_TABS = [
  { id: 'dashboard', label: 'ADRIAN' },
  { id: 'transacciones', label: 'MARIE' },
  { id: 'ana', label: 'ANA' },
  { id: 'padre', label: 'PADRE' },
  { id: 'jefesita', label: 'JEFESITA' },
];

/**
 * Barra de navegación inferior fija para móvil. Se generó la lista de
 * botones a partir de MOBILE_TABS en vez de repetir 5 <button> casi
 * idénticos (el original tenía el mismo bloque copiado y pegado 5 veces).
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
