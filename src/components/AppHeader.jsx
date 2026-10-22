/**
 * @file AppHeader.jsx
 * @component AppHeader
 * @description Componente de encabezado adaptable con selector dinámico de fechas y filtros de transacciones.
 *
 * Funcionalidades Clave:
 * - Muestra el título de la pestaña activa de manera responsiva.
 * - Soporta modos de filtrado por mes completo, fecha específica o rango de fechas.
 * - Incluye controles de acción rápida para alternar entre "Todos los pagos" y "Mes actual".
 *
 * @returns {JSX.Element} Elemento JSX que contiene la cabecera superior de la aplicación.
 *
 * @public:  AppHeader
 * @imports: react, prop-types, ../config/constants, ../utils/dateUtils, ../styles/styles
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TAB_NAMES } from '../config/constants';
import { getCurrentMonthString } from '../utils/dateUtils';
import { excelDropdownStyle, textButtonStyle } from '../styles/styles';

/**
 * Componente de encabezado principal de la aplicación.
 * 
 * Es un componente de presentación (Dumb Component) adaptativo para responsive.
 * Muestra el título de la vista actual, un selector de fecha/mes dinámico y controles de 
 * filtrado rápido (Todos / Mes actual) si la vista activa corresponde a transacciones.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.activeTab - Identificador de la pestaña/vista activa para renderizar su título.
 * @param {boolean} props.isMobile - Flag que determina si se renderiza en diseño responsivo para móviles.
 * @param {string} props.selectedMonth - Valor del mes actualmente seleccionado (ej. "YYYY-MM") o fecha específica.
 * @param {Function} props.onSelectedMonthChange - Callback ejecutado al cambiar la opción del selector de fecha/mes.
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
  const [filterMode, setFilterMode] = useState(
    selectedMonth && selectedMonth.includes('_') ? 'range' : (selectedMonth && selectedMonth.length === 10 ? 'date' : 'month')
  );

  const handleModeChange = (newMode) => {
    setFilterMode(newMode);
    if (newMode === 'month') {
      onSelectedMonthChange(getCurrentMonthString());
    } else if (newMode === 'date') {
      const today = new Date().toISOString().split('T')[0];
      onSelectedMonthChange(today);
    } else if (newMode === 'range') {
      const today = new Date().toISOString().split('T')[0];
      onSelectedMonthChange(`${today}_${today}`);
    }
  };

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

        {/* Selector de modo y valor de fecha / mes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={filterMode}
            onChange={(e) => handleModeChange(e.target.value)}
            disabled={isTransactionTab && mostrarTodos}
            style={{
              ...excelDropdownStyle,
              opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
              cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="month">MES COMPLETO</option>
            <option value="date">FECHA ESPECÍFICA</option>
            <option value="range">RANGO DE FECHAS</option>
          </select>

          {filterMode === 'month' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={selectedMonth && selectedMonth.length >= 4 ? selectedMonth.split('-')[0] : '2023'}
                onChange={(e) => {
                  const currentMonth = selectedMonth && selectedMonth.split('-')[1] ? selectedMonth.split('-')[1] : '01';
                  onSelectedMonthChange(`${e.target.value}-${currentMonth}`);
                }}
                disabled={isTransactionTab && mostrarTodos}
                style={{
                  ...excelDropdownStyle,
                  opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
                  cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
                }}
              >
                {['2023', '2024', '2025', '2026', '2027'].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth && selectedMonth.split('-')[1] ? selectedMonth.split('-')[1] : '01'}
                onChange={(e) => {
                  const currentYear = selectedMonth && selectedMonth.split('-')[0] ? selectedMonth.split('-')[0] : '2023';
                  onSelectedMonthChange(`${currentYear}-${e.target.value}`);
                }}
                disabled={isTransactionTab && mostrarTodos}
                style={{
                  ...excelDropdownStyle,
                  opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
                  cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
                }}
              >
                {[
                  { value: '01', label: 'ENERO' },
                  { value: '02', label: 'FEBRERO' },
                  { value: '03', label: 'MARZO' },
                  { value: '04', label: 'ABRIL' },
                  { value: '05', label: 'MAYO' },
                  { value: '06', label: 'JUNIO' },
                  { value: '07', label: 'JULIO' },
                  { value: '08', label: 'AGOSTO' },
                  { value: '09', label: 'SEPTIEMBRE' },
                  { value: '10', label: 'OCTUBRE' },
                  { value: '11', label: 'NOVIEMBRE' },
                  { value: '12', label: 'DICIEMBRE' }
                ].map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          ) : filterMode === 'date' ? (
            <input
              type="date"
              value={selectedMonth && selectedMonth.length === 10 ? selectedMonth : getCurrentMonthString() + '-01'}
              onChange={(e) => onSelectedMonthChange(e.target.value)}
              disabled={isTransactionTab && mostrarTodos}
              style={{
                ...excelDropdownStyle,
                opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
                cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="date"
                value={selectedMonth && selectedMonth.includes('_') ? selectedMonth.split('_')[0] : getCurrentMonthString() + '-01'}
                onChange={(e) => {
                  const currentEnd = selectedMonth && selectedMonth.includes('_') ? selectedMonth.split('_')[1] : e.target.value;
                  onSelectedMonthChange(`${e.target.value}_${currentEnd}`);
                }}
                disabled={isTransactionTab && mostrarTodos}
                style={{
                  ...excelDropdownStyle,
                  opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
                  cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
                }}
              />
              <span style={{ fontSize: '13px', color: '#64748b' }}>a</span>
              <input
                type="date"
                value={selectedMonth && selectedMonth.includes('_') ? selectedMonth.split('_')[1] : getCurrentMonthString() + '-01'}
                onChange={(e) => {
                  const currentStart = selectedMonth && selectedMonth.includes('_') ? selectedMonth.split('_')[0] : e.target.value;
                  onSelectedMonthChange(`${currentStart}_${e.target.value}`);
                }}
                disabled={isTransactionTab && mostrarTodos}
                style={{
                  ...excelDropdownStyle,
                  opacity: isTransactionTab && mostrarTodos ? 0.5 : 1,
                  cursor: isTransactionTab && mostrarTodos ? 'not-allowed' : 'pointer',
                }}
              />
            </div>
          )}
        </div>

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
                setFilterMode('month');
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

AppHeader.propTypes = {
  activeTab: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  onSelectedMonthChange: PropTypes.func.isRequired,
  monthOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTransactionTab: PropTypes.bool.isRequired,
  mostrarTodos: PropTypes.bool.isRequired,
  onMostrarTodosChange: PropTypes.func.isRequired,
};