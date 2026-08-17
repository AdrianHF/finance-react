// src/components/TransactionsTable.jsx
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
 * Tabla principal de movimientos (mes seleccionado o histórico completo,
 * según `mostrarTodos`), con el resumen de Adeudo/Acumulado anterior,
 * Pagado Este Mes y Total a Pagar Este Mes.
 */
export default function TransactionsTable({
  activeTab, // <-- NUEVA PROP
  isMobile,
  mostrarTodos,
  sortedData,
  metricasResumen,
  adeudoAnterior,
  acumuladoAnterior,
  mostrarAdeudoAnterior,
  mostrarAcumuladoAnterior,
  interesMesAnterior = 0,  // <-- NUEVA PROP (con fallback)
  interesesAcumulados = 0, // <-- NUEVA PROP (con fallback)
  requestSort,
  getSortIcon,
}) {
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      <div
        style={{
          ...metricsHeaderContainer,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '16px',
        }}
      >
        <span style={sectionTitleStyle}>{mostrarTodos ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS DEL MES'}</span>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : '40px',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'left',
          }}
        >
          {mostrarAdeudoAnterior && (
            <div>
              <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
                Adeudo Anterior
              </span>
              <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>${fmt(adeudoAnterior)}</span>
            </div>
          )}
          
          
          {/* ========================================================================= */}
          {/* BLOQUE EXCLUSIVO PARA TAB 'PADRE' (INTERESES 2.23333%)                    */}
          {/* ========================================================================= */}
          {activeTab === 'padre' && (
            <>
              {interesMesAnterior > 0 && (
                <div>
                  <span style={{ fontSize: '11px', color: '#b45309', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
                    Interés Mes Anterior
                  </span>
                  <span style={{ color: '#b45309', fontSize: '15px', fontWeight: '700' }}>
                    ${fmt(interesMesAnterior)}
                  </span>
                </div>
              )}

              {interesesAcumulados > 0 && (
                <div>
                  <span style={{ fontSize: '11px', color: '#b45309', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
                    Intereses Acumulados
                  </span>
                  <span style={{ color: '#b45309', fontSize: '15px', fontWeight: '700' }}>
                    ${fmt(interesesAcumulados)}
                  </span>
                </div>
              )}
            </>
          )}
          {/* ========================================================================= */}

          {mostrarAcumuladoAnterior && (
            <div>
              <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
                Acumulado Anterior
              </span>
              <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>${fmt(acumuladoAnterior)}</span>
            </div>
          )}

          <div>
            <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              Pagado Este Mes
            </span>
            <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>${fmt(metricasResumen.pagado)}</span>
          </div>

          <div>
            <span
              style={{
                fontSize: '11px',
                color: metricasResumen.porPagar < 0 ? '#11532a' : '#991b1b',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              {metricasResumen.porPagar < 0 ? 'Pagado de Más Este Mes' : 'Restante Por Pagar Este Mes'}
            </span>
            <span
              style={{
                color: metricasResumen.porPagar < 0 ? '#11532a' : '#991b1b',
                fontSize: '15px',
                fontWeight: '700',
              }}
            >
              ${fmt(Math.abs(metricasResumen.porPagar))}
            </span>
          </div>

          <div
            style={{
              borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
              borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
              paddingLeft: isMobile ? '0' : '40px',
              paddingTop: isMobile ? '10px' : '0',
            }}
          >
            <span style={{ fontSize: '11px', color: '#000000', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              TOTAL A PAGAR ESTE MES
            </span>
            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>${fmt(metricasResumen.totalMensual)}</span>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '650px' : 'auto' }}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort('date')}>Fecha {getSortIcon('date')}</th>
              <th style={thStyle} onClick={() => requestSort('description')}>Descripción {getSortIcon('description')}</th>
              <th style={thStyle} onClick={() => requestSort('money_bucket_name')}>Money Bucket {getSortIcon('money_bucket_name')}</th>
              <th style={thStyle} onClick={() => requestSort('product_name')}>Producto {getSortIcon('product_name')}</th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>Monto {getSortIcon('amount')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                  No hay transacciones registradas para este periodo.
                </td>
              </tr>
            ) : (
              sortedData.map((t) => (
                <tr key={t.transaction_id} style={trHoverStyle}>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>{t.description || <span style={emptyDashStyle}>sin descripción</span>}</td>
                  <td style={tdStyle}>
                    <span style={bucketLabelStyle}>{t.money_bucket_name}</span>
                  </td>
                  <td style={tdStyle}>{t.product_name}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600', color: t.amount >= 0 ? '#16a34a' : '#dc2626' }}>
                    {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
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
