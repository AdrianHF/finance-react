/**
 * @file useSortConfig.jsx
 * @component useSortConfig
 * @description Hook personalizado para gestionar el estado y la lógica de ordenamiento de tablas o listas.
 *
 * Funcionalidades Clave:
 * - Alterna dinámicamente la dirección de ordenamiento entre ascendente, descendente y sin orden.
 * - Mantiene el estado actual de la configuración de ordenamiento.
 * - Genera el icono visual correspondiente según el estado de ordenamiento de cada columna.
 *
 * @returns {Object} Objeto con la configuración actual, la función para solicitar ordenamiento y el generador de iconos.
 *
 * @public:  useSortConfig
 * @imports: react
 */

import { useState, useCallback } from 'react';

export function useSortConfig(initialConfig = { key: null, direction: 'asc' }) {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { key: null, direction: 'asc' };
        }
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const getSortIcon = useCallback((key) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      return <img src="/defaultSort.svg" alt="Default sort" className="sort-icon" width="16" height="16" />;
    }
    if (sortConfig.direction === 'asc') {
      return <img src="/ascSort.svg" alt="Ascending sort" className="sort-icon" width="16" height="16" />;
    }
    return <img src="/descSort.svg" alt="Descending sort" className="sort-icon" width="16" height="16" />;
  }, [sortConfig]);

  return {
    sortConfig,
    requestSort: handleSort,
    getSortIcon,
  };
}