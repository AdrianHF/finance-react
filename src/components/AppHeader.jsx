// src/components/AppHeader.jsx
import React from 'react';
import { TAB_NAMES } from '../config/constants';
import { getCurrentMonthString } from '../utils/dateUtils';
import { excelDropdownStyle, textButtonStyle } from '../styles/styles';

/**
 * Encabezado superior: nombre del tab activo, selector de mes y (solo en
 * tabs de transacciones) los botones "TODOS LOS PAGOS" / "MES ACTUAL".
 *
 * Es un componente puramente de presentación: no sabe de dónde salen
 * `monthOptions` ni qué pasa al cambiar de mes, solo dispara callbacks.
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
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          {TAB_NAMES[activeTab]}
        </h1>

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

        {isTransactionTab && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => onMostrarTodosChange(true)} style={textButtonStyle(mostrarTodos)}>
              TODOS LOS PAGOS
            </button>
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
