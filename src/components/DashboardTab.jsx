// src/components/DashboardTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
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
 * Componente de pestaña Principal (Dashboard / Vista de Resumen).
 * 
 * Es un componente de presentación pura que muestra el estado financiero del mes seleccionado:
 * 1. Resumen métrico general (Total Pagado, Por Pagar, Total Mensual).
 * 2. Calculadora interactiva en tiempo real para determinar el saldo faltante contra el monto disponible ingresado.
 * 3. Tabla detallada de productos/estados de cuenta con ordenamiento por columnas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isMobile - Determina si la interfaz debe adaptarse a pantallas pequeñas.
 * @param {Array<Object>} props.sortedData - Listado de productos ordenados a renderizar en la tabla.
 * @param {Object} props.metricasFinancieras - Resumen de importes calculados del mes.
 * @param {number} props.metricasFinancieras.pagado - Suma acumulada de importes en estado pagado.
 * @param {number} props.metricasFinancieras.porPagar - Suma acumulada de importes pendientes de pago.
 * @param {number} props.metricasFinancieras.totalGeneral - Suma total esperada del mes.
 * @param {string|number} props.montoDisponible - Valor introducido por el usuario para calcular el faltante.
 * @param {Function} props.onMontoDisponibleChange - Callback al cambiar el input de monto disponible.
 * @param {Function} props.requestSort - Callback para ordenar la tabla según la clave recibida ('name', 'payday_limit', 'status', 'amount').
 * @param {Function} props.getSortIcon - Callback que retorna el indicador visual de ordenamiento (flechas asc/desc).
 * 
 * @returns {JSX.Element} Vista del Dashboard del usuario.
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
  // Cálculo del faltante (garantiza un mínimo de 0 para evitar valores negativos)
  const faltante = Math.max(0, metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0));
  
  // Bandera para ajustar dinámicamente el estilo del faltante (verde si está cubierto, ámbar si aún falta)
  const faltanteEsCero = metricasFinancieras.porPagar - (parseFloat(montoDisponible) || 0) <= 0;

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      {/* Reset global para ocultar los spinners/flechas por defecto del input[type="number"] */}
      <style>{numberInputResetCSS}</style>

      {/* Sección de Encabezado: Título y Tarjetas de Métricas */}
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
          {/* Métrica: Pagado */}
          <div>
            <span style={{ fontSize: '11px', color: '#11532a', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              Pagado
            </span>
            <span style={{ color: '#11532a', fontSize: '15px', fontWeight: '700' }}>
              ${metricasFinancieras.pagado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Métrica: Por Pagar */}
          <div>
            <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>
              Por Pagar
            </span>
            <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>
              ${metricasFinancieras.porPagar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Métrica: Total Mensual */}
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

          {/* Métrica / Calculadora rápida: Disponible vs Faltante */}
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
            {/* Campo editable: Disponible */}
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

            {/* Resultado calculado: Faltante */}
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

      {/* Tabla Principal de Registros Mensuales */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '500px' : 'auto' }}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => requestSort('name')}>
                Producto {getSortIcon('name')}
              </th>
              <th style={thStyle} onClick={() => requestSort('payday_limit')}>
                Fecha Límite {getSortIcon('payday_limit')}
              </th>
              <th style={thStyle} onClick={() => requestSort('status')}>
                Estado {getSortIcon('status')}
              </th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => requestSort('amount')}>
                Monto {getSortIcon('amount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              // Obtiene el estado de cuenta correspondiente al período actual (si existe)
              const statement = item.bank_statements && item.bank_statements[0];
              const tieneInformacionEsteMes = !!statement;
              const currentStatus = tieneInformacionEsteMes ? statement.status : 'FALTA CAPTURAR';
              const esInactivoONoAplica = currentStatus === 'PRODUCTO INACTIVO' || currentStatus === 'NO APLICA';

              return (
                <tr key={item.product_id || item.id} style={trHoverStyle}>
                  {/* Nombre del producto */}
                  <td style={{ ...tdStyle, fontWeight: '500' }}>{item.name}</td>
                  
                  {/* Fecha Límite de Pago */}
                  <td style={tdStyle}>
                    {tieneInformacionEsteMes && !esInactivoONoAplica && statement.payday_limit
                      ? statement.payday_limit
                      : <span style={emptyDashStyle}>—</span>}
                  </td>
                  
                  {/* Badge de Estado del Pago */}
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(currentStatus)}>
                      {currentStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  
                  {/* Monto del Estado de Cuenta */}
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