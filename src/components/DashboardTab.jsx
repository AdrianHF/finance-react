// src/components/DashboardTab.jsx
import React from 'react';
import {
  tableCardStyle,
  metricsHeaderContainer,
  sectionTitleStyle,
  thStyle,
  tdStyle,
  trHoverStyle,
  emptyDashStyle,
  getStatusBadgeStyle,
  numberInputResetCSS,
} from '../styles/styles';

/**
 * Tab ADRIAN: tabla de productos/bank_statements del mes, resumen de
 * Pagado/Por Pagar/Total, y la calculadora de Disponible/Faltante.
 *
 * Todos los datos (sortedData, métricas) y el ordenamiento vienen ya
 * resueltos desde `useDashboardData` en App.jsx; este componente solo
 * se encarga de pintar la UI y de leer/escribir `montoDisponible`.
 */
export default function DashboardTab({
  isMobile,
  sortedData,
  metricasFinancieras,
  montoDisponible,
  onMontoDisponibleChange,
  requestSort,
  getSortIcon,
}) {
  const faltante = Math.max(0, metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0));
  const faltanteEsCero = metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0) <= 0;

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      {/* Reset de las flechitas del input number (Chrome/Safari/Edge/Firefox) */}
      <style>{numberInputResetCSS}</style>

      <div
        style={{
          ...metricsHeaderContainer,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <span style={sectionTitleStyle}>PAGOS DEL MES</span>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '40px',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'left',
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              Pagado
            </span>
            <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>
              ${metricasFinancieras.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              Por Pagar
            </span>
            <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>
              ${metricasFinancieras.porPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Total Mensual
            </span>
            <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>
              ${metricasFinancieras.totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Calculadora de restante */}
          <div
            style={{
              borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
              borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
              paddingLeft: isMobile ? '0' : '40px',
              paddingTop: isMobile ? '10px' : '0',
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
              alignItems: 'stretch',
            }}
          >
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                DISPONIBLE
              </span>
              <input
                type="number"
                placeholder="$ 0.00"
                value={montoDisponible}
                onChange={(e) => onMontoDisponibleChange(e.target.value)}
                style={{
                  width: '100px',
                  padding: '6px 10px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontWeight: '600',
                  textAlign: 'center',
                  margin: 0,
                }}
              />
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                FALTANTE
              </span>
              <div style={{ height: '31px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: faltanteEsCero ? '#11532a' : '#b45309', fontSize: '14px', fontWeight: '800' }}>
                  ${faltante.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '500px' : 'auto' }}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort('name')}>Producto {getSortIcon('name')}</th>
              <th style={thStyle} onClick={() => requestSort('payday_limit')}>Fecha Límite {getSortIcon('payday_limit')}</th>
              <th style={thStyle} onClick={() => requestSort('status')}>Estado {getSortIcon('status')}</th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>Monto {getSortIcon('amount')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              const statement = item.bank_statements && item.bank_statements[0];
              const tieneInformacionEsteMes = !!statement;
              const currentStatus = tieneInformacionEsteMes ? statement.status : 'FALTA CAPTURAR';
              const esInactivoONoAplica = currentStatus === 'PRODUCTO INACTIVO' || currentStatus === 'NO APLICA';

              return (
                <tr key={item.product_id || item.id} style={trHoverStyle}>
                  <td style={{ ...tdStyle, fontWeight: '500' }}>{item.name}</td>
                  <td style={tdStyle}>
                    {tieneInformacionEsteMes && !esInactivoONoAplica && statement.payday_limit
                      ? statement.payday_limit
                      : <span style={emptyDashStyle}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(currentStatus)}>{currentStatus.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                    {tieneInformacionEsteMes && !esInactivoONoAplica && statement.amount !== null
                      ? `$${parseFloat(statement.amount).toFixed(2)}`
                      : <span style={emptyDashStyle}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
