/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Componente de encabezado principal adaptativo que muestra títulos, selector de mes y controles de filtrado.
 *
 * Funcionalidades Clave:
 * - Renderiza dinámicamente el título según la pestaña activa de la aplicación
 * - Proporciona un selector desplegable para filtrar registros por mes
 * - Incluye controles de acción rápida para alternar entre "Todos los pagos" y "Mes actual"
 * - Adapta su diseño estructural y tipográfico para dispositivos móviles y de escritorio
 *
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior de la aplicación
 */

import React from 'react';
import PropTypes from 'prop-types';
import { TAB_NAMES } from '../config/constants';
import { getCurrentMonthString } from '../utils/dateUtils';
import { excelDropdownStyle, textButtonStyle } from '../styles/styles';

/**
 * Componente de encabezado principal de la aplicación.
 * 
 * Es un componente de presentación (Dumb Component) adaptativo para responsive.
 * Muestra el título de la vista actual, un selector de mes dinámico y controles de 
 * filtrado rápido (Todos / Mes actual) si la vista activa corresponde a transacciones.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.activeTab - Identificador de la pestaña/vista activa para renderizar su título.
 * @param {boolean} props.isMobile - Flag que determina si se renderiza en diseño responsivo para móviles.
 * @param {string} props.selectedMonth - Valor del mes actualmente seleccionado (ej. "YYYY-MM").
 * @param {Function} props.onSelectedMonthChange - Callback ejecutado al cambiar la opción del selector de mes.
 * @param {Array<{value: string, label: string}>} props.monthOptions - Lista de opciones disponibles para el menú desplegable de meses.
 * @param {boolean} props.isTransactionTab - Indica si la pestaña activa permite filtros de transacciones.
 * @param {boolean} props.mostrarTodos - Flag que indica si se están visualizando todas las transacciones sin filtro de mes.
 * @param {Function} props.onMostrarTodosChange - Callback para alternar el estado del filtro entre "Todos" y por mes.
 * 
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior.
 */
export default function AppHeader({
  activeTab,
  isMobile,
  selectedMonth,
  onSelectedMonthChange,
  monthOptions,
  isTransactionTab,
  mostrarTodos,
  onMostrarTodosChange,
}) {
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '16px',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        {/* Título de la pestaña activa */}
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          {TAB_NAMES[activeTab]}
        </h1>

        {/* Desplegable de selección de mes */}
        <select
          value={selectedMonth}
          onChange={(e) => onSelectedMonthChange(e.target.value)}
          disabled={isTransactionTab && mostrarTodos}
          style={{
            ...excelDropdownStyle,
            opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
            cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
          }}
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Botones de acción rápida exclusivos para pestañas de transacciones */}
        {isTransactionTab && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Activa la vista global de todos los pagos */}
            <button 
              onClick={() => onMostrarTodosChange(true)} 
              style={textButtonStyle(mostrarTodos)}
            >
              TODOS LOS PAGOS
            </button>

            {/* Restablece la vista al mes en curso y desactiva el filtro global */}
            <button
              onClick={() => {
                onMostrarTodosChange(false);
                onSelectedMonthChange(getCurrentMonthString());
              }}
              style={textButtonStyle(!mostrarTodos && selectedMonth === getCurrentMonthString())}
            >
              MES ACTUAL
            </button>
          </div>
        )}
      </div>
    </header>
  );
}