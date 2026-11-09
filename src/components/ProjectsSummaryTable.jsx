/**
 * @file ProjectsSummaryTable.jsx
 * @component ProjectsSummaryTable
 * @description Renderiza una tabla resumen del progreso financiero e histórico de proyectos con barras de avance.
 *
 * Funcionalidades Clave:
 * - Muestra el progreso visual de pagos y cuotas por cada proyecto mediante barras de avance.
 * - Desglosa montos cobrados, montos restantes y deudas totales en formato de hoja de cálculo.
 * - Incluye tooltips informativos para aclarar la diferencia entre pagos de usuario y cobros procesados.
 * - Presenta un pie de tabla consolidado con el balance global de deudas, dinero recibido y saldo pendiente.
 * - Adapta su diseño responsivo con scroll horizontal para visualización móvil.
 *
 * @returns {JSX.Element} Tabla de resumen financiero de proyectos estilizada.
 *
 * @public:  ProjectsSummaryTable
 * @imports: react, prop-types, ../styles/styles
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  excelCardStyle,
  excelThStyle,
  excelTdStyle,
  excelTrStyle,
  infoIconStyle,
  progressBarTrackStyle,
  progressBarFillStyle,
} from '../styles/styles';

/**
 * Función auxiliar para formatear valores numéricos a moneda en formato US (ej. 1,234.56).
 * 
 * @param {number} n - Valor numérico a formatear.
 * @returns {string} Cadena numérica formateada con dos decimales.
 */
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Tabla de Resumen Histórico por Proyectos (Buckets).
 * 
 * Renderiza el progreso general de pago por proyecto mediante barras de avance visual,
 * desglosa cuotas y montos completados, y presenta en el pie de página la liquidación
 * global de deudas vs. dinero recibido.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isMobile - Determina si la tabla debe habilitar scroll horizontal para móviles.
 * @param {Object} props.resumenBuckets - Estructura de datos consolidada de proyectos y totales.
 * @param {Array<Object>} props.resumenBuckets.proyectos - Lista de proyectos a desplegar.
 * @param {string|number} props.resumenBuckets.proyectos[].id - Identificador del proyecto.
 * @param {string} props.resumenBuckets.proyectos[].name - Nombre del proyecto.
 * @param {number} props.resumenBuckets.proyectos[].cuotasCompletadas - Cantidad de cuotas/pagos procesados por el banco.
 * @param {number} props.resumenBuckets.proyectos[].totalCuotas - Cantidad total de cuotas del proyecto.
 * @param {number} props.resumenBuckets.proyectos[].montoCompletado - Monto recaudado/liquidado a la fecha.
 * @param {number} props.resumenBuckets.proyectos[].montoTotalCobrado - Presupuesto o monto total esperado del proyecto.
 * @param {number} props.resumenBuckets.proyectos[].deudaTotal - Importe de deuda asignada al proyecto.
 * @param {number} props.resumenBuckets.totalDeudaProyectos - Sumatoria total de deudas acumuladas de todos los proyectos.
 * @param {number} props.resumenBuckets.totalAportadoPersonal - Dinero total ingresado/recibido.
 * @param {number} props.resumenBuckets.restaPorPagarGlobal - Diferencia global pendiente por cubrir.
 * 
 * @returns {JSX.Element} Tabla en estilo hoja de cálculo con barra de progreso de pagos.
 */
export default function ProjectsSummaryTable({ isMobile, resumenBuckets }) {
  const { proyectos, totalDeudaProyectos, totalAportadoPersonal, restaPorPagarGlobal } = resumenBuckets;

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={excelCardStyle}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif', minWidth: isMobile ? '760px' : 'auto' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={excelThStyle}>DEUDAS</th>
                <th style={excelThStyle}>
                  PROGRESO EN PAGOS{' '}
                  {/* Tooltip informativo sobre la diferencia entre pagos hechos y cobros procesados */}
                  <span
                    title="El progreso mostrado corresponde a los cobros que el banco ya ha procesado, no necesariamente a tus pagos. Si pagas a tiempo, ambos coincidirán."
                    style={infoIconStyle}
                  >
                    i
                  </span>
                </th>
                <th style={{ ...excelThStyle, textAlign: 'right' }}>MONTO RESTANTE</th>
                <th style={{ ...excelThStyle, textAlign: 'right' }}>DEUDA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length === 0 ? (
                /* Estado vacío cuando no existen registros */
                <tr>
                  <td colSpan="4" style={{ ...excelTdStyle, textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    No hay cobros de proyectos registrados.
                  </td>
                </tr>
              ) : (
                /* Iteración de filas por cada proyecto registrado */
                proyectos.map((proyecto) => {
                  // Cálculo porcentual del avance de cuotas del proyecto
                  const porcentaje = proyecto.totalCuotas > 0 ? (proyecto.cuotasCompletadas / proyecto.totalCuotas) * 100 : 0;
                  const montoRestante = Math.max(0, (proyecto.montoTotalCobrado || 0) - (proyecto.montoCompletado || 0));
                  
                  return (
                    <tr key={proyecto.id} style={excelTrStyle}>
                      {/* Nombre e ID del Proyecto */}
                      <td style={{ ...excelTdStyle, fontWeight: '500' }}>
                        {proyecto.name.toUpperCase()} <span style={{ fontSize: '10px', color: '#64748b' }}>(ID: {proyecto.id})</span>
                      </td>

                      {/* Barra visual de progreso y métricas de cuotas/montos */}
                      <td style={{ ...excelTdStyle, whiteSpace: 'nowrap' }}>
                        <div style={{ width: '250px' }}>
                          <div style={progressBarTrackStyle}>
                            <div style={progressBarFillStyle(porcentaje)} />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: '4px',
                              fontSize: '11px',
                              color: '#64748b',
                              fontWeight: '400',
                            }}
                          >
                            <div>({proyecto.cuotasCompletadas} / {proyecto.totalCuotas})</div>
                            <div>(${fmt(proyecto.montoCompletado)} / ${fmt(proyecto.montoTotalCobrado)})</div>
                          </div>
                        </div>
                      </td>

                      {/* Monto Restante por Pagar del Proyecto */}
                      <td style={{ ...excelTdStyle, textAlign: 'right', color: '#475569', fontWeight: '600' }}>
                        ${fmt(montoRestante)}
                      </td>

                      {/* Importe de Deuda Total del Proyecto */}
                      <td style={{ ...excelTdStyle, textAlign: 'right', color: '#475569', fontWeight: '600' }}>
                        ${fmt(proyecto.deudaTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Pie de Tabla: Totales Consolidados */}
            <tfoot style={{ borderTop: '2px solid #cbd5e1', fontWeight: '700' }}>
              {/* Total Deudas */}
              <tr style={{ backgroundColor: '#fdf2f2' }}>
                <td colSpan="3" style={{ ...excelTdStyle, color: '#8d402a' }}>DEUDA TOTAL</td>
                <td style={{ ...excelTdStyle, textAlign: 'right', color: '#8d402a', fontWeight: '800' }}>${fmt(totalDeudaProyectos)}</td>
              </tr>

              {/* Total Ingresado / Recibido */}
              <tr style={{ backgroundColor: '#f0fdf4' }}>
                <td colSpan="3" style={{ ...excelTdStyle, color: '#588157' }}>DINERO RECIBIDO</td>
                <td style={{ ...excelTdStyle, textAlign: 'right', color: '#588157', fontWeight: '800' }}>${fmt(totalAportadoPersonal)}</td>
              </tr>

              {/* Saldo Restante Global por Liquidar */}
              <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #94a3b8' }}>
                <td colSpan="3" style={{ ...excelTdStyle, color: '#0f172a', fontSize: '13px', fontWeight: '800' }}>
                  MONTO RESTANTE POR PAGAR
                </td>
                <td
                  style={{
                    ...excelTdStyle,
                    textAlign: 'right',
                    color: restaPorPagarGlobal <= 0 ? '#588157' : '#8d402a',
                    fontSize: '14px',
                    fontWeight: '900',
                  }}
                >
                  ${fmt(restaPorPagarGlobal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

ProjectsSummaryTable.propTypes = {
  isMobile: PropTypes.bool,
  resumenBuckets: PropTypes.shape({
    proyectos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        cuotasCompletadas: PropTypes.number.isRequired,
        totalCuotas: PropTypes.number.isRequired,
        montoCompletado: PropTypes.number.isRequired,
        montoTotalCobrado: PropTypes.number.isRequired,
        deudaTotal: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalDeudaProyectos: PropTypes.number.isRequired,
    totalAportadoPersonal: PropTypes.number.isRequired,
    restaPorPagarGlobal: PropTypes.number.isRequired,
  }).isRequired,
};