/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra el historial detallado de transacciones de un proyecto con filtros, ordenamiento y métricas financieras resumidas.
 *
 * Funcionalidades Clave:
 * - Renderiza una tabla responsiva con scroll horizontal adaptable para dispositivos móviles.
 * - Calcula y muestra métricas consolidadas de costos, ingresos programados y balance total.
 * - Permite filtrar los movimientos dinámicamente por tipo (todos, costos o ingresos).
 * - Soporta ordenamiento interactivo de columnas mediante callbacks externos.
 * - Formatea importes monetarios con separadores de miles y dos decimales, aplicando colores según el signo.
 *
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 *
 * @public:  ProjectTransactionsTable
 * @imports: react, prop-types, ../styles/styles
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
  const [filtroMovimiento, setFiltroMovimiento] = React.useState('todos');

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

  const sumaCostos = sortedData.reduce((acc, t) => {
    const val = Number(t.amount) || 0;
    return val < 0 ? acc + val : acc;
  }, 0);

  const sumaIngresos = sortedData.reduce((acc, t) => {
    const val = Number(t.amount) || 0;
    return val > 0 ? acc + val : acc;
  }, 0);

  const sumaTotal = sumaCostos + sumaIngresos;

  const filteredSortedData = sortedData.filter((t) => {
    const val = Number(t.amount) || 0;
    if (filtroMovimiento === 'costos') return val < 0;
    if (filtroMovimiento === 'ingresos') return val > 0;
    return true;
  });

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={sectionTitleStyle}>
            {mostrarTodos ? 'TODOS LOS MOVIMIENTOS' : 'MOVIMIENTOS DEL MES'}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setFiltroMovimiento('todos')}
              style={{
                backgroundColor: filtroMovimiento === 'todos' ? '#2e3a48' : '#e2e8f0',
                color: filtroMovimiento === 'todos' ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFiltroMovimiento('costos')}
              style={{
                backgroundColor: filtroMovimiento === 'costos' ? '#8d402a' : '#e2e8f0',
                color: filtroMovimiento === 'costos' ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Costos
            </button>
            <button
              type="button"
              onClick={() => setFiltroMovimiento('ingresos')}
              style={{
                backgroundColor: filtroMovimiento === 'ingresos' ? '#588157' : '#e2e8f0',
                color: filtroMovimiento === 'ingresos' ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Ingresos
            </button>
          </div>
        </div>

        {/* Bloque de Métricas Resumen */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '16px' : '24px',
            alignItems: 'center',
          }}
        >
          {/* Métrica 1: Costos (Suma de negativos) */}
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
              Costos
            </span>
            <span
              style={{
                color: '#8d402a',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(sumaCostos)}
            </span>
          </div>

          {/* Métrica 2: Ingresos Programados (Suma de positivos) */}
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
              Ingresos Programados
            </span>
            <span
              style={{
                color: '#588157',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              ${fmt(sumaIngresos)}
            </span>
          </div>

          {/* Métrica 3: Total (Suma de ambos) */}
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
              Total
            </span>
            <span
              style={{
                color: sumaTotal >= 0 ? '#588157' : '#8d402a',
                fontSize: '16px',
                fontWeight: '800',
              }}
            >
              {sumaTotal >= 0 ? '' : '-'}${fmt(Math.abs(sumaTotal))}
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
            {filteredSortedData.length === 0 ? (
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
              filteredSortedData.map((t) => (
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
                      color: t.amount >= 0 ? '#588157' : '#8d402a',
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