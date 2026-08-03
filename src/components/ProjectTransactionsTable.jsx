// src/components/ProjectTransactionsTable.jsx
import React from 'react';
import {
  tableCardStyle,
  metricsHeaderContainer,
  sectionTitleStyle,
  thStyle,
  tdStyle,
  trHoverStyle,
  emptyDashStyle,
  bucketLabelStyle,
} from '../styles/styles';

/**
 * Tabla de movimientos por Proyecto / Money Bucket.
 * Muestra el título, las métricas del mes (Total a pagar, Pagado, Restante por pagar)
 * y la lista de transacciones.
 */
export default function ProjectTransactionsTable({
  isMobile,
  mostrarTodos,
  sortedData = [],
  totalMensual = 0,
  requestSort,
  getSortIcon,
}) {
  const fmt = (n) =>
    (Number(n) || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // 1. Pagado este mes: suma de montos positivos (> 0)
  const pagadoEsteMes = sortedData.reduce((acc, t) => {
    const val = Number(t.amount) || 0;
    return val > 0 ? acc + val : acc;
  }, 0);

  // 2. Restante por pagar este mes: 
  // Convierte totalMensual a valor de deuda/negativo y le suma lo pagado
  const restantePorPagar = (-1 * Math.abs(totalMensual)) + pagadoEsteMes;

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      {/* Encabezado con Título y Métricas */}
      <div
        style={{
          ...metricsHeaderContainer,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <span style={sectionTitleStyle}>
          {mostrarTodos ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS DEL MES'}
        </span>

        {/* Bloque de Métricas Resumen */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '16px' : '24px',
            alignItems: 'center',
          }}
        >
          {/* Métrica 1: Total a pagar este mes */}
          <div>
            <span
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Total a pagar este mes
            </span>
            <span
              style={{
                color: '#0f172a',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(totalMensual)}
            </span>
          </div>

          {/* Métrica 2: Pagado este mes */}
          <div>
            <span
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Pagado este mes
            </span>
            <span
              style={{
                color: '#16a34a',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(pagadoEsteMes)}
            </span>
          </div>

          {/* Métrica 3: Restante por pagar este mes */}
          <div>
            <span
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Restante por pagar
            </span>
            <span
              style={{
                color: restantePorPagar >= 0 ? '#16a34a' : '#dc2626',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(restantePorPagar)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: isMobile ? '650px' : 'auto',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort && requestSort('date')}>
                Fecha {getSortIcon && getSortIcon('date')}
              </th>
              <th style={thStyle} onClick={() => requestSort && requestSort('description')}>
                Descripción {getSortIcon && getSortIcon('description')}
              </th>
              <th style={thStyle} onClick={() => requestSort && requestSort('payer_loaner_name')}>
                Pagador {getSortIcon && getSortIcon('payer_loaner_name')}
              </th>
              <th style={thStyle} onClick={() => requestSort && requestSort('product_name')}>
                Producto {getSortIcon && getSortIcon('product_name')}
              </th>
              <th
                style={{ ...thStyle, textAlign: 'right' }}
                onClick={() => requestSort && requestSort('amount')}
              >
                Monto {getSortIcon && getSortIcon('amount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    ...tdStyle,
                    textAlign: 'center',
                    color: '#94a3b8',
                    padding: '30px',
                  }}
                >
                  No hay transacciones registradas para este periodo.
                </td>
              </tr>
            ) : (
              sortedData.map((t) => (
                <tr key={t.transaction_id} style={trHoverStyle}>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>
                    {t.description || (
                      <span style={emptyDashStyle}>sin descripción</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={bucketLabelStyle}>{t.payer_loaner_name}</span>
                  </td>
                  <td style={tdStyle}>{t.product_name}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: 'right',
                      fontWeight: '600',
                      color: t.amount >= 0 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {t.amount >= 0 ? '+' : ''}${fmt(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}