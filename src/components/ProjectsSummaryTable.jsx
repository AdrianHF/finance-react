// src/components/ProjectsSummaryTable.jsx
import React from 'react';
import {
  excelCardStyle,
  excelThStyle,
  excelTdStyle,
  excelTrStyle,
  infoIconStyle,
  progressBarTrackStyle,
  progressBarFillStyle,
} from '../styles/styles';

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Resumen histórico por proyectos: deuda por bucket, barra de progreso
 * de cobro y totales (deuda total / dinero recibido / restante).
 */
export default function ProjectsSummaryTable({ isMobile, resumenBuckets }) {
  const { proyectos, totalDeudaProyectos, totalAportadoPersonal, restaPorPagarGlobal } = resumenBuckets;

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={excelCardStyle}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace, sans-serif', minWidth: isMobile ? '760px' : 'auto' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={excelThStyle}>DEUDAS</th>
                <th style={excelThStyle}>
                  PROGRESO EN PAGOS{' '}
                  <span
                    title="El progreso mostrado corresponde a los cobros que el banco ya ha procesado, no necesariamente a tus pagos. Si pagas a tiempo, ambos coincidirán."
                    style={infoIconStyle}
                  >
                    i
                  </span>
                </th>
                <th style={{ ...excelThStyle, textAlign: 'right' }}>DEUDA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ ...excelTdStyle, textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    No hay cobros de proyectos registrados.
                  </td>
                </tr>
              ) : (
                proyectos.map((proyecto) => {
                  const porcentaje = proyecto.totalCuotas > 0 ? (proyecto.cuotasCompletadas / proyecto.totalCuotas) * 100 : 0;
                  return (
                    <tr key={proyecto.id} style={excelTrStyle}>
                      <td style={{ ...excelTdStyle, fontWeight: '500' }}>
                        {proyecto.name.toUpperCase()} <span style={{ fontSize: '10px', color: '#64748b' }}>(ID: {proyecto.id})</span>
                      </td>
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
                      <td style={{ ...excelTdStyle, textAlign: 'right', color: '#475569', fontWeight: '600' }}>
                        ${fmt(proyecto.deudaTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot style={{ borderTop: '2px solid #cbd5e1', fontWeight: '700' }}>
              <tr style={{ backgroundColor: '#fdf2f2' }}>
                <td colSpan="2" style={{ ...excelTdStyle, color: '#991b1b' }}>DEUDA TOTAL</td>
                <td style={{ ...excelTdStyle, textAlign: 'right', color: '#991b1b', fontWeight: '800' }}>${fmt(totalDeudaProyectos)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f0fdf4' }}>
                <td colSpan="2" style={{ ...excelTdStyle, color: '#16a34a' }}>DINERO RECIBIDO</td>
                <td style={{ ...excelTdStyle, textAlign: 'right', color: '#16a34a', fontWeight: '800' }}>${fmt(totalAportadoPersonal)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #94a3b8' }}>
                <td colSpan="2" style={{ ...excelTdStyle, color: '#0f172a', fontSize: '13px', fontWeight: '800' }}>
                  MONTO RESTANTE POR PAGAR
                </td>
                <td
                  style={{
                    ...excelTdStyle,
                    textAlign: 'right',
                    color: restaPorPagarGlobal <= 0 ? '#16a34a' : '#b91c1c',
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
