/**
 * @file DashboardMonthlyChart.jsx
 * @component DashboardMonthlyChart
 * @description Gráfico de líneas interactivo en SVG para visualizar el total mensual a pagar en el panel de control.
 *
 * Funcionalidades Clave:
 * - Parseo robusto y seguro de montos monetarios desde diversos formatos de backend.
 * - Ordenamiento cronológico inteligente de datos históricos (ISO, nombres de meses ES/EN).
 * - Renderizado SVG responsivo con ejes, rejilla dinámica y área de ploteo adaptativa.
 * - Tooltip interactivo y líneas guías (crosshair) al pasar el cursor sobre los puntos.
 * - Agregación defensiva de múltiples filas por mes y soporte para diseño móvil.
 *
 * @returns {JSX.Element} Componente renderizado del gráfico mensual.
 *
 * @public:  DashboardMonthlyChart
 * @imports: react, prop-types, ../styles/styles
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { tableCardStyle, sectionTitleStyle } from '../styles/styles';

/* ------------------------------------------------------------------ */
/*  Parseo robusto (US / EU / con símbolos de moneda / objetos anidados) */
/* ------------------------------------------------------------------ */
const toNumber = (v) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;

  // Algunos backends envuelven el monto en { amount | total | value | monto | sum }
  if (v && typeof v === 'object') {
    const inner = v.amount ?? v.total ?? v.value ?? v.monto ?? v.sum ?? null;
    return toNumber(inner);
  }

  if (typeof v !== 'string') return 0;

  let s = v.trim().replace(/[^\d.,-]/g, '');
  if (!s || s === '-' || s === '.' || s === ',') return 0;

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    s = s.lastIndexOf(',') > s.lastIndexOf('.')
      ? s.replace(/\./g, '').replace(',', '.')
      : s.replace(/,/g, '');
  } else if (hasComma) {
    const parts = s.split(',');
    s = parts.length === 2 && parts[1].length <= 2
      ? s.replace(',', '.')
      : s.replace(/,/g, '');
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (v) =>
  `$${toNumber(v).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatAxis = (val) => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val.toFixed(0)}`;
};

/* ------------------------------------------------------------------ */
/*  Orden cronológico tolerante (ISO, nombres ES/EN, o respeta al padre) */
/* ------------------------------------------------------------------ */
const MONTH_NAMES_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MONTH_NAMES_EN = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

const monthIndexFromLabel = (label) => {
  if (!label) return -1;
  const k = String(label).trim().slice(0, 3).toLowerCase();
  const es = MONTH_NAMES_ES.indexOf(k);
  return es >= 0 ? es : MONTH_NAMES_EN.indexOf(k);
};

const sortChronologically = (arr) => {
  const allISO = arr.every((d) => /^\d{4}[-/]\d{1,2}/.test(String(d.month ?? '')));
  if (allISO) {
    return [...arr].sort((a, b) => String(a.month).localeCompare(String(b.month)));
  }
  const allLabels = arr.every((d) => monthIndexFromLabel(d.month ?? d.label) >= 0);
  if (allLabels) {
    return [...arr].sort(
      (a, b) =>
        monthIndexFromLabel(a.month ?? a.label) -
        monthIndexFromLabel(b.month ?? b.label)
    );
  }
  return [...arr];
};

/* ------------------------------------------------------------------ */
/*  Extracción del monto "a pagar" por mes                             */
/*  Se prueban varios nombres habituales para no depender del backend. */
/* ------------------------------------------------------------------ */
const MONTO_FIELDS = [
  'porPagar',
  'aPagar',
  'totalAPagar',
  'montoAPagar',
  'totalMensual',
  'total',
  'amount',
  'monto',
  'sum',
  'value',
  'totalGeneral',
  'pagado',
];

const extractMontoAPagar = (item) => {
  for (const key of MONTO_FIELDS) {
    if (item && item[key] !== undefined && item[key] !== null) {
      return toNumber(item[key]);
    }
  }
  return 0;
};

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */
export default function DashboardMonthlyChart({ historicalData, isMobile }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = useMemo(() => {
    if (!Array.isArray(historicalData)) return [];

    const normalized = historicalData.map((d, i) => ({
      ...d,
      __idx: i,
      total: extractMontoAPagar(d),   // ← monto a pagar de cada mes
    }));

    const sorted = sortChronologically(normalized);

    // Agregación defensiva: si hay varias filas por mes, se suman
    const byMonth = new Map();
    for (const d of sorted) {
      const key = String(d.month ?? d.label ?? d.__idx);
      const prev = byMonth.get(key);
      if (prev) {
        prev.total += d.total;
        prev.duplicated = true;
      } else {
        byMonth.set(key, { ...d, duplicated: false });
      }
    }

    return Array.from(byMonth.values());
  }, [historicalData]);

  const maxTotal = data.reduce((m, d) => (d.total > m ? d.total : m), 0);
  const adjustedMax = maxTotal <= 0 ? 100 : maxTotal * 1.15;

  const width = 1000;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 10;
  const paddingBottom = 24;

  // Aire lateral: los puntos no tocan los extremos. Las líneas punteadas SÍ.
  const xPadding = 40;
  const plotLeft = paddingLeft + xPadding;
  const plotRight = width - paddingRight - xPadding;
  const plotWidth = plotRight - plotLeft;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((item, idx) => {
    const x =
      data.length === 1
        ? plotLeft + plotWidth / 2
        : plotLeft + (idx / (data.length - 1)) * plotWidth;
    const y = paddingTop + chartHeight - (item.total / adjustedMax) * chartHeight;
    return { x, y, item };
  });

  const pathD = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  const handleMouseMove = (e) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    let closest = 0;
    let min = Infinity;
    points.forEach((p, idx) => {
      const d = Math.abs(p.x - svgX);
      if (d < min) { min = d; closest = idx; }
    });
    setHoveredIndex(closest);
  };

  // Paleta alineada con la tarjeta "Por Pagar" del DashboardTab
  const COLOR_PRIMARY = '#8d402a';
  const COLOR_ACCENT  = '#b91c1c';
  const COLOR_GRID    = '#e2e8f0';
  const COLOR_TEXT    = '#475569';
  const COLOR_AXIS    = '#64748b';

  return (
    <div style={{ ...tableCardStyle, padding: isMobile ? '16px' : '24px', marginTop: '20px' }}>
      <span style={{ ...sectionTitleStyle, display: 'block', marginBottom: '16px' }}>
        TOTAL MENSUAL A PAGAR
      </span>

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>
          No hay datos históricos disponibles para mostrar.
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', paddingTop: '10px' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{
              width: '100%',
              height: 'auto',
              minWidth: isMobile ? '350px' : '500px',
              cursor: 'crosshair',
              userSelect: 'none',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <clipPath id="chart-clip">
                <rect
                  x={plotLeft - 8}
                  y={paddingTop}
                  width={plotWidth + 16}
                  height={chartHeight}
                />
              </clipPath>
            </defs>

            {/* Grid horizontal — a TODO el ancho (de paddingLeft a width-paddingRight) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const val = adjustedMax * (1 - ratio);
              const y = paddingTop + chartHeight * ratio;
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={COLOR_GRID}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    fontSize="10"
                    fill={COLOR_AXIS}
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {formatAxis(val)}
                  </text>
                </g>
              );
            })}

            {/* Línea + puntos (recortados al área del plot) */}
            <g clipPath="url(#chart-clip)">
              <path
                d={pathD}
                fill="none"
                stroke={COLOR_PRIMARY}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 5 : 3}
                  fill={hoveredIndex === i ? COLOR_ACCENT : '#fff'}
                  stroke={COLOR_PRIMARY}
                  strokeWidth="1.5"
                  style={{ transition: 'all .15s ease' }}
                />
              ))}
            </g>

            {/* Labels del eje X */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 6}
                fontSize="10"
                fill={COLOR_TEXT}
                textAnchor="middle"
                fontWeight="600"
              >
                {p.item.label || p.item.month}
              </text>
            ))}

            {/* Crosshair + tooltip */}
            {hoveredIndex !== null && points[hoveredIndex] && (() => {
              const p = points[hoveredIndex];
              const tw = 110;
              const th = 40;
              let tx = Math.max(
                paddingLeft,
                Math.min(p.x - tw / 2, width - paddingRight - tw)
              );
              let ty = p.y - th - 12;
              if (ty < paddingTop) ty = p.y + 15;

              return (
                <g pointerEvents="none">
                  {/* Vertical: sigue al punto */}
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={height - paddingBottom}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Horizontal: a TODO el ancho (no respeta el xPadding) */}
                  <line
                    x1={paddingLeft}
                    y1={p.y}
                    x2={width - paddingRight}
                    y2={p.y}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  <g transform={`translate(${tx}, ${ty})`}>
                    <rect
                      width={tw}
                      height={th}
                      rx="6"
                      fill="#1e293b"
                      opacity="0.92"
                    />
                    <text
                      x={tw / 2}
                      y={15}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {p.item.label || p.item.month}
                    </text>
                    <text
                      x={tw / 2}
                      y={30}
                      fontSize="11"
                      fill="#ffffff"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {formatMoney(p.item.total)}
                    </text>
                  </g>
                </g>
              );
            })()}
          </svg>
        </div>
      )}
    </div>
  );
}

DashboardMonthlyChart.propTypes = {
  /**
   * Histórico mensual. El monto "a pagar" se extrae automáticamente del primer campo
   * presente entre: porPagar | aPagar | totalAPagar | montoAPagar | totalMensual | total | amount.
   */
  historicalData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      porPagar: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      aPagar: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      totalAPagar: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      montoAPagar: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      totalMensual: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      total: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  isMobile: PropTypes.bool,
};

DashboardMonthlyChart.defaultProps = {
  historicalData: [],
  isMobile: false,
};