/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra la tabla de transacciones de un proyecto y calcula métricas financieras en tiempo de render.
 *
 * Funcionalidades Clave:
 * - Renderiza el historial detallado de movimientos (abonos y cargos) con soporte responsivo.
 * - Calcula dinámicamente el monto total pagado en el mes mediante abonos positivos.
 * - Calcula el saldo restante por pagar del periodo actual y la deuda total consolidada.
 * - Soporta ordenamiento interactivo de columnas mediante callbacks externos.
 * - Formatea importes monetarios y aplica indicadores visuales según el estado de los saldos.
 *
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 */

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
  bucketLabelStyle,
} from '../styles/styles';

/**
 * Tabla de Transacciones y Movimientos de Proyecto.
 * 
 * Muestra el historial detallado de movimientos (abonos/cargos) de un periodo o histórico general.
 * Además, calcula dinámicamente en tiempo de render:
 * 1. El monto total pagado en el mes (abonos positivos).
 * 2. El saldo restante por pagar del periodo actual.
 * 3. La deuda total acumulada consolidando el adeudo de meses anteriores.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isMobile - Determina si la tabla habilita el scroll horizontal responsivo.
 * @param {boolean} props.mostrarTodos - Indica si se están visualizando todos los movimientos o solo los del mes seleccionado.
 * @param {Array<Object>} [props.sortedData=[]] - Arreglo de transacciones ordenadas a listar.
 * @param {string|number} props.sortedData[].transaction_id - Identificador único de la transacción.
 * @param {string} props.sortedData[].date - Fecha del movimiento.
 * @param {string} [props.sortedData[].description] - Descripción o concepto del movimiento.
 * @param {string} props.sortedData[].payer_loaner_name - Nombre de la entidad, pagador o prestamista.
 * @param {string} props.sortedData[].product_name - Nombre del producto o servicio asociado.
 * @param {number} props.sortedData[].amount - Monto de la transacción (positivo para abonos, negativo para cargos).
 * @param {number} [props.totalMensual=0] - Presupuesto o monto total a cubrir en el mes en curso.
 * @param {number} [props.adeudoAnterior=0] - Saldo pendiente de liquidar acumulado de periodos previos.
 * @param {Function} [props.requestSort] - Callback ejecutado al hacer clic en un encabezado de columna para ordenar.
 * @param {Function} [props.getSortIcon] - Callback que devuelve el icono/flecha del estado actual de ordenamiento.
 * 
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 */
export default function ProjectTransactionsTable({
  isMobile,
  mostrarTodos,
  sortedData = [],
  totalMensual = 0,
  adeudoAnterior = 0,
  requestSort,
  getSortIcon,
}) {
  /**
   * Helper para formatear valores a moneda (US Dollars) con 2 decimales.
   *
   * @param {number|string} n - Valor a formatear.
   * @returns {string} Importe con separadores de miles y 2 decimales.
   */
  const fmt = (n) =>
    (Number(n) || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // 1. Pagado este mes: Sumatoria exclusiva de abonos positivos (> 0)
  const pagadoEsteMes = sortedData.reduce((acc, t) => {
    const val = Number(t.amount) || 0;
    return val > 0 ? acc + val : acc;
  }, 0);

  // 2. Restante por pagar del mes actual (limita a 0 como mínimo)
  const restanteMesActual = Math.max(0, totalMensual - pagadoEsteMes);

  // 3. Deuda Total acumulada (Consolida el adeudo anterior + el restante del mes)
  const totalRestanteConsolidado = adeudoAnterior + restanteMesActual;

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      {/* Encabezado: Título dinámico y bloque de tarjetas métricas */}
      <div
        style={{
          ...metricsHeaderContainer,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Título dinámico según el filtro global */}
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
          {/* Métrica 1: Adeudo Arrastrado (Solo visible en filtro mensual) */}
          {!mostrarTodos && (
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
                Adeudo Anterior
              </span>
              <span
                style={{
                  color: adeudoAnterior > 0 ? '#dc2626' : '#16a34a',
                  fontSize: '16px',
                  fontWeight: '800',
                }}
              >
                ${fmt(adeudoAnterior)}
              </span>
            </div>
          )}

          {/* Métrica 2: Total a pagar programado para el mes */}
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

          {/* Métrica 3: Suma acumulada de abonados en el mes */}
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

          {/* Métrica 4: Deuda Total Pendiente (Adeudo anterior + Restante) */}
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
              Deuda Total Pendiente
            </span>
            <span
              style={{
                color: totalRestanteConsolidado > 0 ? '#dc2626' : '#16a34a',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(totalRestanteConsolidado)}
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor de la Tabla de Datos con scroll responsivo */}
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
              /* Estado sin registros */
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
              /* Mapeo de transacciones */
              sortedData.map((t) => (
                <tr key={t.transaction_id} style={trHoverStyle}>
                  {/* Fecha */}
                  <td style={tdStyle}>{t.date}</td>

                  {/* Descripción / Concepto */}
                  <td style={tdStyle}>
                    {t.description || (
                      <span style={emptyDashStyle}>sin descripción</span>
                    )}
                  </td>

                  {/* Entidad Pagadora / Prestamista */}
                  <td style={tdStyle}>
                    <span style={bucketLabelStyle}>{t.payer_loaner_name}</span>
                  </td>

                  {/* Nombre del Producto */}
                  <td style={tdStyle}>{t.product_name}</td>

                  {/* Importe formateado y coloreado según el signo */}
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