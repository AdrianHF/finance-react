// src/hooks/useSortConfig.js
import { useState } from 'react';

/**
 * Maneja el estado de "sortConfig" (columna activa + dirección asc/desc)
 * que usan tanto la tabla de ADRIAN como las tablas de transacciones.
 *
 * Se mantiene en App.jsx (no dentro de cada tabla) porque, igual que en
 * el código original, el sortConfig se reinicia manualmente cada vez que
 * se cambia de tab (ej. al hacer click en "MARIE" se vuelve a ordenar
 * por fecha). Ese reinicio se hace con `setSortConfig`, que este hook
 * expone junto con `requestSort` (click en un header de columna) y
 * `getSortIcon` (flechita ▲▼ junto al nombre de la columna).
 */
export function useSortConfig(initialConfig) {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return { sortConfig, setSortConfig, requestSort, getSortIcon };
}
