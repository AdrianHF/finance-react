/**
 * @file TransactionsTable.jsx
 * @component TransactionsTable
 * @description Tabla principal de movimientos financieros con resumen de métricas y soporte responsivo.
 *
 * Funcionalidades Clave:
 * - Muestra un listado detallado de transacciones ordenables por columna
 * - Presenta métricas resumidas del mes (pagos, adeudos y totales a liquidar)
 * - Soporta bloques condicionales exclusivos para la pestaña padre (intereses)
 * - Se adapta dinámicamente a vistas móviles y de escritorio
 *
 * @returns {JSX.Element} Elemento JSX de la tabla de transacciones con su resumen de métricas.
 */

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
 * Objeto con las métricas resumidas del mes actual.
 * @typedef {Object} MetricasResumen
 * @property {number} pagado - Monto abonado o pagado en el mes actual.
 * @property {number} porPagar - Monto restante por pagar o saldo a favor si es negativo.
 * @property {number} totalMensual - Total acumulado a liquidar en el mes.
 */

/**
 * Estructura de un elemento del listado de transacciones.
 * @typedef {Object} Transaction
 * @property {string|number} transaction_id - Identificador único de la transacción.
 * @property {string} date - Fecha formateada de la transacción.
 * @property {string} [description] - Descripción del movimiento (opcional).
 * @property {string} money_bucket_name - Nombre de la cubeta de dinero/categoría.
 * @property {string} product_name - Nombre del producto financiero asociado.
 * @property {number} amount - Monto numérico (positivos representan abonos, negativos cargos).
 */

/**
 * Propiedades del componente TransactionsTable.
 * @typedef {Object} TransactionsTableProps
 * @property {string} [activeTab] - Identificador de la pestaña activa (ej. 'padre').
 * @property {boolean} isMobile - Indica si el renderizado debe ser adaptado a pantallas móviles.
 * @property {boolean} mostrarTodos - Si es `true` muestra el título "TODOS LOS MOVIMIENTOS", de lo contrario "MOVIMIENTOS DEL MES".
 * @property {Transaction[]} sortedData - Arreglo de transacciones previamente ordenadas.
 * @property {MetricasResumen} metricasResumen - Objeto con los totales de pago y saldos del mes.
 * @property {number} [adeudoAnterior] - Monto del adeudo de periodos pasados.
 * @property {number} [acumuladoAnterior] - Monto a favor acumulado de periodos pasados.
 * @property {boolean} mostrarAdeudoAnterior - Alterna la visibilidad de la sección de Adeudo Anterior.
 * @property {boolean} mostrarAcumuladoAnterior - Alterna la visibilidad de la sección de Acumulado Anterior.
 * @property {number} [interesMesAnterior=0] - Monto de interés generado el mes previo (exclusivo para tab 'padre').
 * @property {number} [interesesAcumulados=0] - Monto de intereses acumulados hasta la fecha (exclusivo para tab 'padre').
 * @property {function(string): void} requestSort - Callback para solicitar el reordenamiento por la columna indicada.
 * @property {function(string): React.ReactNode} getSortIcon - Función que retorna el ícono visual correspondiente al estado de ordenamiento.
 */

/**
 * Tabla principal de movimientos (mes seleccionado o histórico completo,
 * según `mostrarTodos`), con el resumen de Adeudo/Acumulado anterior,
 * Pagado Este Mes y Total a Pagar Este Mes.
 * 
 * @param {TransactionsTableProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX de la tabla de transacciones con su resumen de métricas.
 */
export default function TransactionsTable({
  activeTab,
  isMobile,
  mostrarTodos,
  sortedData,
  metricasResumen,
  adeudoAnterior,
  acumuladoAnterior,
  mostrarAdeudoAnterior,
  mostrarAcumuladoAnterior,
  interesMesAnterior = 0,
  interesesAcumulados = 0,
  requestSort,
  getSortIcon,
}) {
  /**
   * Formatea un número al estándar monetario en inglés con 2 decimales.
   * @param {number} n - Número a formatear.
   * @returns {string} Cadena numérica formateada (ej: "1,234.56").
   */
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
        <span style={sectionTitleStyle}>
          {mostrarTodos ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS DEL MES'}
        </span>

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