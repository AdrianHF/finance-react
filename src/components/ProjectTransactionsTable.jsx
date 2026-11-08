/**
 * @file ProjectTransactionsTable.jsx
 * @component ProjectTransactionsTable
 * @description Muestra el historial detallado de movimientos, costos e ingresos de un proyecto con filtros y métricas consolidadas.
 *
 * Funcionalidades Clave:
 * - Visualización de transacciones financieras con soporte para filtros de búsqueda por columna y ordenamiento.
 * - Resumen agrupado por pagador mostrando pagos, cobros y diferencia neta.
 * - Cálculo dinámico de costos totales, ingresos programados y balance general.
 *
 * @returns {JSX.Element} Vista de tabla con el listado de movimientos y métricas consolidadas.
 *
 * @public:  ProjectTransactionsTable
 * @imports: react, prop-types, ../styles/styles
 */

import React, { useState, useMemo } from 'react';
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
  const [filtroMovimiento, setFiltroMovimiento] = useState('todos');
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    description: '',
    payer_loaner_name: '',
    product_name: '',
    amount: '',
  });
  const [activeSearchCol, setActiveSearchCol] = useState(null);

  const handleSearchChange = (col, val) => {
    setSearchFilters((prev) => ({ ...prev, [col]: val }));
  };

  const toggleSearchCol = (col) => {
    setActiveSearchCol((prev) => (prev === col ? null : col));
  };

  const payerTotals = sortedData.reduce((acc, t) => {
    const name = t.payer_loaner_name || 'Sin Pagador';
    const val = Number(t.amount) || 0;
    if (!acc[name]) {
      acc[name] = { pagos: 0, cobros: 0, count: 0 };
    }
    if (val > 0) {
      acc[name].pagos += val;
    } else if (val < 0) {
      acc[name].cobros += Math.abs(val);
    }
    acc[name].count += 1;
    return acc;
  }, {});

  const payerEntries = Object.entries(payerTotals).sort((a, b) => ((b[1].pagos - b[1].cobros)) - ((a[1].pagos - a[1].cobros)));

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

  const filteredSortedData = useMemo(() => {
    return sortedData.filter((t) => {
      const val = Number(t.amount) || 0;
      if (filtroMovimiento === 'costos' && val >= 0) return false;
      if (filtroMovimiento === 'ingresos' && val <= 0) return false;

      const dateMatch = String(t.date || '').toLowerCase().includes(searchFilters.date.toLowerCase());
      const descMatch = String(t.description || '').toLowerCase().includes(searchFilters.description.toLowerCase());
      const payerMatch = String(t.payer_loaner_name || '').toLowerCase().includes(searchFilters.payer_loaner_name.toLowerCase());
      const productMatch = String(t.product_name || '').toLowerCase().includes(searchFilters.product_name.toLowerCase());
      const amountStr = (t.amount >= 0 ? '+' : '') + (Number(t.amount) || 0).toFixed(2);
      const amountMatch = String(t.amount).toLowerCase().includes(searchFilters.amount.toLowerCase()) || amountStr.toLowerCase().includes(searchFilters.amount.toLowerCase());

      return dateMatch && descMatch && payerMatch && productMatch && amountMatch;
    });
  }, [sortedData, filtroMovimiento, searchFilters]);

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px' }}>
      {/* Visualización agrupada por PAGADOR: PAGOS, COBROS y DIFERENCIA */}
      {payerEntries.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Resumen por Pagador
          </span>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {payerEntries.map(([payerName, data]) => {
              const diferencia = data.pagos - data.cobros;
              return (
                <div
                  key={payerName}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    minWidth: '220px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#334155',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {payerName}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#94a3b8',
                        fontWeight: '600',
                      }}
                    >
                      {data.count} {data.count === 1 ? 'mov.' : 'movs.'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>PAGOS:</span>
                      <span style={{ fontWeight: '700', color: '#588157' }}>+${fmt(data.pagos)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>COBROS:</span>
                      <span style={{ fontWeight: '700', color: '#8d402a' }}>-${fmt(data.cobros)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '4px', marginTop: '2px' }}>
                      <span style={{ color: '#475569', fontWeight: '700' }}>DIFERENCIA:</span>
                      <span style={{ fontWeight: '800', color: diferencia >= 0 ? '#588157' : '#8d402a' }}>
                        {diferencia >= 0 ? '' : '-'}${fmt(Math.abs(diferencia))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              <th style={thStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span onClick={() => requestSort('date')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                    Fecha {getSortIcon ? getSortIcon('date') : <img src="/defaultSort.svg" alt="sort" style={{ width: '12px', height: '12px' }} />}
                  </span>
                  <img src="/magnifier.svg" alt="Buscar" onClick={(e) => { e.stopPropagation(); toggleSearchCol('date'); }} style={{ width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '6px' }} title="Buscar por Fecha" />
                </div>
                {activeSearchCol === 'date' && (
                  <div style={{ marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Buscar fecha..."
                      value={searchFilters.date}
                      onChange={(e) => handleSearchChange('date', e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                      autoFocus
                    />
                  </div>
                )}
              </th>
              <th style={thStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span onClick={() => requestSort('description')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                    Descripción {getSortIcon ? getSortIcon('description') : <img src="/defaultSort.svg" alt="sort" style={{ width: '12px', height: '12px' }} />}
                  </span>
                  <img src="/magnifier.svg" alt="Buscar" onClick={(e) => { e.stopPropagation(); toggleSearchCol('description'); }} style={{ width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '6px' }} title="Buscar por Descripción" />
                </div>
                {activeSearchCol === 'description' && (
                  <div style={{ marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Buscar descripción..."
                      value={searchFilters.description}
                      onChange={(e) => handleSearchChange('description', e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                      autoFocus
                    />
                  </div>
                )}
              </th>
              <th style={thStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span onClick={() => requestSort('payer_loaner_name')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                    Pagador {getSortIcon ? getSortIcon('payer_loaner_name') : <img src="/defaultSort.svg" alt="sort" style={{ width: '12px', height: '12px' }} />}
                  </span>
                  <img src="/magnifier.svg" alt="Buscar" onClick={(e) => { e.stopPropagation(); toggleSearchCol('payer_loaner_name'); }} style={{ width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '6px' }} title="Buscar por Pagador" />
                </div>
                {activeSearchCol === 'payer_loaner_name' && (
                  <div style={{ marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Buscar pagador..."
                      value={searchFilters.payer_loaner_name}
                      onChange={(e) => handleSearchChange('payer_loaner_name', e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                      autoFocus
                    />
                  </div>
                )}
              </th>
              <th style={thStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span onClick={() => requestSort('product_name')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                    Producto {getSortIcon ? getSortIcon('product_name') : <img src="/defaultSort.svg" alt="sort" style={{ width: '12px', height: '12px' }} />}
                  </span>
                  <img src="/magnifier.svg" alt="Buscar" onClick={(e) => { e.stopPropagation(); toggleSearchCol('product_name'); }} style={{ width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '6px' }} title="Buscar por Producto" />
                </div>
                {activeSearchCol === 'product_name' && (
                  <div style={{ marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={searchFilters.product_name}
                      onChange={(e) => handleSearchChange('product_name', e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                      autoFocus
                    />
                  </div>
                )}
              </th>
              <th style={{ ...thStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span onClick={() => requestSort('amount')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Monto {getSortIcon ? getSortIcon('amount') : <img src="/defaultSort.svg" alt="sort" style={{ width: '12px', height: '12px' }} />}
                  </span>
                  <img src="/magnifier.svg" alt="Buscar" onClick={(e) => { e.stopPropagation(); toggleSearchCol('amount'); }} style={{ width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', marginLeft: '6px' }} title="Buscar por Monto" />
                </div>
                {activeSearchCol === 'amount' && (
                  <div style={{ marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      placeholder="Buscar monto..."
                      value={searchFilters.amount}
                      onChange={(e) => handleSearchChange('amount', e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', textAlign: 'right' }}
                      autoFocus
                    />
                  </div>
                )}
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