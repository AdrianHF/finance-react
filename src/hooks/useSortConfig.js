// src/hooks/useSortConfig.js
import { useState } from 'react';

/**
 * Estado que define la columna por la cual ordenar y la dirección actual.
 * @typedef {Object} SortConfig
 * @property {string|null} key - Clave o nombre del campo por el cual se aplica el ordenamiento.
 * @property {'asc'|'desc'} direction - Dirección del ordenamiento (ascendente o descendente).
 */

/**
 * Objeto de retorno devuelto por el Custom Hook `useSortConfig`.
 * @typedef {Object} UseSortConfigReturn
 * @property {SortConfig} sortConfig - Estado actual con la columna activa y la dirección.
 * @property {React.Dispatch<React.SetStateAction<SortConfig>>} setSortConfig - Función para sobreescribir manualmente la configuración de ordenamiento.
 * @property {function(string): void} requestSort - Callback para alternar la columna o dirección al interactuar con el encabezado de la tabla.
 * @property {function(string): string} getSortIcon - Función que devuelve el indicador visual (flecha) según el estado actual de la columna.
 */

/**
 * Custom Hook que centraliza la lógica de ordenamiento para tablas.
 * Controla qué columna está activa, conmuta la dirección (`asc` ↔ `desc`)
 * y proporciona los íconos visuales de estado para los encabezados.
 *
 * @param {SortConfig} initialConfig - Configuración de ordenamiento inicial.
 * @returns {UseSortConfigReturn} Objeto con el estado del ordenamiento y las funciones auxiliares para manipularlo.
 */
export function useSortConfig(initialConfig) {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  /**
   * Actualiza el estado de ordenamiento. Si la columna seleccionada ya era la activa
   * y estaba en orden ascendente, cambia a descendente; de lo contrario, establece
   * la nueva columna en orden ascendente.
   *
   * @param {string} key - Identificador de la columna a ordenar.
   * @returns {void}
   */
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Retorna el símbolo/flecha correspondiente a la columna especificada según la dirección del orden.
   *
   * @param {string} name - Nombre de la columna a evaluar.
   * @returns {string} Cadena con el símbolo `' ↕'` si no está activa, `' ▲'` para ascendente o `' ▼'` para descendente.
   */
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return { sortConfig, setSortConfig, requestSort, getSortIcon };
}