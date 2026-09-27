/**
 * @file styles.js
 * @component StylesModule
 * @description Módulo de estilos centralizados basado en CSS-in-JS para la interfaz de usuario.
 *
 * Funcionalidades Clave:
 * - Define una paleta de colores corporativa y tokens de diseño reutilizables.
 * - Proporciona generadores de estilos dinámicos para estados, botones y barras de progreso.
 * - Incluye conjuntos de estilos estáticos para tablas, tarjetas y elementos tipográficos.
 * - Centraliza reglas CSS globales y utilidades visuales para mantener la consistencia visual.
 *
 * @returns {Object} Colección de objetos de estilo y funciones generadoras de CSS-in-JS.
 */

/**
 * @fileoverview Modulo de estilos centralizados de la aplicacion (CSS-in-JS).
 * Contiene objetos de estilos en linea, funciones generadoras de estilo dinámico 
 * e inyecciones CSS globales para asegurar consistencia visual y reutilizacion.
 */

/**
 * Tokens de paleta corporativa sobria (Neutral Slate / Blue Accent):
 * - Neutro base: #f1f5f9 (fondo), #ffffff (superficie), #e2e8f0 / #cbd5e1 (bordes)
 * - Texto: #0f172a (principal), #334155 (secundario), #64748b (muted), #94a3b8 (desactivado)
 * - Azul corporativo acento: #3b6ea5 (usado con moderación para estados activos/destacados)
 */

export const PALETTE = {
  nav: '#1e293b',
  navHover: 'rgba(255,255,255,0.08)',
  navActive: 'rgba(255,255,255,0.12)',
  accent: '#3b6ea5',
  accentDark: '#2c5282',
  pageBg: '#f1f5f9',
  surface: '#ffffff',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textDisabled: '#94a3b8',
  success: '#2d6a4f',
  successBg: '#e2f0ea',
  danger: '#991b1b',
  dangerBg: '#fef2f2',
  warning: '#92400e',
  warningBg: '#fef3c7',
  radius: '6px'
};

/**
 * Objeto de reglas CSS-in-JS para react.
 * @typedef {Object.<string, string|number>} CSSProperties
 */

/**
 * Genera el estilo visual para los badges de estado de productos/transacciones.
 *
 * @param {'PAGADO'|'POR PAGAR'|'NO DISPONIBLE AUN'|'PRODUCTO INACTIVO'|'NO APLICA'|string} status - Estado actual del elemento.
 * @returns {CSSProperties} Objeto de estilos dinámicos para el badge.
 */
export const getStatusBadgeStyle = (status) => {
  /** @type {CSSProperties} */
  const baseBadgeStyle = {
    padding: '4px 8px',
    borderRadius: PALETTE.radius,
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };
  switch (status) {
    case 'PAGADO':
      return { ...baseBadgeStyle, backgroundColor: PALETTE.successBg, color: PALETTE.success };
    case 'POR PAGAR':
      return { ...baseBadgeStyle, backgroundColor: PALETTE.warningBg, color: PALETTE.warning };
    case 'NO DISPONIBLE AUN':
      return { ...baseBadgeStyle, backgroundColor: PALETTE.pageBg, color: PALETTE.textMuted };
    case 'PRODUCTO INACTIVO':
      return { ...baseBadgeStyle, backgroundColor: PALETTE.border, color: PALETTE.textMuted };
    case 'NO APLICA':
      return { ...baseBadgeStyle, backgroundColor: PALETTE.border, color: PALETTE.textMuted, fontStyle: 'italic' };
    default:
      return { ...baseBadgeStyle, backgroundColor: PALETTE.dangerBg, color: PALETTE.danger };
  }
};

/**
 * Estilo para los botones de navegacion en la barra lateral (Sidebar principal).
 *
 * @param {boolean} isActive - Indica si el tab correspondiente esta seleccionado.
 * @returns {CSSProperties} Estilos del boton del sidebar.
 */
export const tabButtonStyle = (isActive) => ({
  width: '100%',
  textAlign: 'left',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '0',
  fontSize: '15px',
  cursor: 'pointer',
  color: '#ffffff',
  backgroundColor: isActive ? PALETTE.navActive : 'transparent',
  fontWeight: isActive ? '600' : 'normal',
  transition: 'background 0.2s',
  margin: 0,
  display: 'block',
});

/**
 * Estilo para los botones de navegacion de Buckets/Proyectos en la barra lateral.
 *
 * @param {boolean} isActive - Indica si la pestaña del bucket esta activa.
 * @returns {CSSProperties} Estilos con esquema de color corporativo desaturado.
 */
export const tabButtonStyleBuckets = (isActive) => ({
  width: '100%',
  textAlign: 'left',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '0',
  fontSize: '15px',
  cursor: 'pointer',
  color: '#ffffff',
  backgroundColor: isActive ? PALETTE.navActive : 'transparent',
  fontWeight: isActive ? '600' : 'normal',
  transition: 'background 0.2s',
  margin: 0,
  display: 'block',
});

/**
 * Estilo para los botones de la barra de navegacion inferior en dispositivos moviles.
 *
 * @param {boolean} isActive - Indica si la opcion del menu movil esta seleccionada.
 * @returns {CSSProperties} Estilos optimizados para interaccion tactil y diseño flex.
 */
export const mobileTabButtonStyle = (isActive) => ({
  flex: 1,
  height: '100%',
  background: 'none',
  border: 'none',
  color: isActive ? '#ffffff' : PALETTE.textDisabled,
  fontSize: '10px',
  fontWeight: isActive ? '700' : '400',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: isActive ? PALETTE.navActive : 'transparent',
});

/**
 * Estilo para botones de texto o toggle (ej: "TODOS LOS PAGOS" vs "MES ACTUAL").
 *
 * @param {boolean} isHighlighted - Controla si el boton se muestra resaltado o neutro.
 * @returns {CSSProperties} Estilos para botones de alternancia.
 */
export const textButtonStyle = (isHighlighted) => ({
  backgroundColor: isHighlighted ? 'rgba(59, 110, 165, 0.1)' : 'transparent',
  color: isHighlighted ? PALETTE.accentDark : PALETTE.textMuted,
  border: isHighlighted ? `1px solid ${PALETTE.accent}` : '1px solid transparent',
  borderRadius: PALETTE.radius,
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  outline: 'none',
});

/**
 * Estilos para selectores desplegables con estetica similar a Excel.
 * @type {CSSProperties}
 */
export const excelDropdownStyle = {
  padding: '6px 12px',
  fontSize: '13px',
  fontWeight: '600',
  color: PALETTE.textMuted,
  backgroundColor: PALETTE.surface,
  border: `1px solid ${PALETTE.borderStrong}`,
  borderRadius: PALETTE.radius,
  cursor: 'pointer',
  outline: 'none',
};

/**
 * Contenedor tipo tarjeta para las tablas con vista inspirada en hojas de calculo.
 * @type {CSSProperties}
 */
export const excelCardStyle = {
  backgroundColor: PALETTE.surface,
  borderRadius: PALETTE.radius,
  border: `1px solid ${PALETTE.borderStrong}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  overflow: 'hidden',
};

/**
 * Estilos para encabezados (`<th>`) de tablas estilo Excel.
 * @type {CSSProperties}
 */
export const excelThStyle = {
  padding: '10px 14px',
  fontSize: '11px',
  fontWeight: '700',
  color: PALETTE.textMuted,
  borderBottom: `2px solid ${PALETTE.borderStrong}`,
  borderRight: `1px solid ${PALETTE.border}`,
  cursor: 'pointer',
  textAlign: 'left',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

/**
 * Estilos para celdas de datos (`<td>`) de tablas estilo Excel.
 * @type {CSSProperties}
 */
export const excelTdStyle = {
  padding: '10px 14px',
  fontSize: '13px',
  color: PALETTE.textSecondary,
  borderBottom: `1px solid ${PALETTE.border}`,
  borderRight: `1px solid ${PALETTE.pageBg}`,
  whiteSpace: 'nowrap',
};

/**
 * Estilos base para las filas (`<tr>`) en vistas tipo Excel.
 * @type {CSSProperties}
 */
export const excelTrStyle = {
  borderBottom: `1px solid ${PALETTE.border}`,
  backgroundColor: PALETTE.surface,
};

/**
 * Estilos para etiquetas pequenas de Buckets / Categorias monetarias.
 * @type {CSSProperties}
 */
export const bucketLabelStyle = {
  backgroundColor: PALETTE.surface,
  padding: '2px 6px',
  borderRadius: PALETTE.radius,
  border: `1px solid ${PALETTE.border}`,
  fontSize: '11px',
};

/**
 * Contenedor flex superior para organizar metricas y resumenes financieros.
 * @type {CSSProperties}
 */
export const metricsHeaderContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: `1px solid ${PALETTE.pageBg}`,
};

/**
 * Estilos para titulos de seccion dentro del dashboard.
 * @type {CSSProperties}
 */
export const sectionTitleStyle = {
  color: PALETTE.textPrimary,
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.02em',
};

/**
 * Estilos para tarjetas en estado vacio o sin datos cargados (Placeholders).
 * @type {CSSProperties}
 */
export const placeholderCardStyle = {
  backgroundColor: PALETTE.surface,
  border: `1px dashed ${PALETTE.borderStrong}`,
  borderRadius: PALETTE.radius,
  padding: '40px 20px',
  textAlign: 'center',
  color: PALETTE.textMuted,
};

/**
 * Contenedor estandar con sombra ligera para tarjetas de tablas.
 * @type {CSSProperties}
 */
export const tableCardStyle = {
  backgroundColor: PALETTE.surface,
  borderRadius: PALETTE.radius,
  border: `1px solid ${PALETTE.border}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

/**
 * Estilos por defecto para encabezados de tabla estandar (`<th>`).
 * @type {CSSProperties}
 */
export const thStyle = {
  padding: '12px 14px',
  fontSize: '11px',
  fontWeight: '600',
  color: PALETTE.textMuted,
  textTransform: 'uppercase',
  textAlign: 'left',
  borderBottom: `2px solid ${PALETTE.border}`,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

/**
 * Estilos por defecto para celdas de tabla estandar (`<td>`).
 * @type {CSSProperties}
 */
export const tdStyle = {
  padding: '12px 14px',
  fontSize: '13px',
  color: PALETTE.textSecondary,
  borderBottom: `1px solid ${PALETTE.pageBg}`,
  whiteSpace: 'nowrap',
};

/**
 * Transicion dinamica para el comportamiento hover de filas en tablas.
 * @type {CSSProperties}
 */
export const trHoverStyle = {
  transition: 'background-color 0.15s',
};

/**
 * Estilo visual para representar valores nulos o guiones vacios (`—`).
 * @type {CSSProperties}
 */
export const emptyDashStyle = {
  color: PALETTE.textDisabled,
  fontStyle: 'italic',
};

/**
 * Estilo circular para el icono tooltip de informacion (`i`).
 * @type {CSSProperties}
 */
export const infoIconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: PALETTE.borderStrong,
  color: '#ffffff',
  fontSize: '10px',
  fontStyle: 'italic',
  fontWeight: '700',
  cursor: 'help',
  userSelect: 'none',
};

/**
 * Contenedor/Pista base para barras de progreso de liquidez o pago.
 * @type {CSSProperties}
 */
export const progressBarTrackStyle = {
  width: '100%',
  height: '8px',
  borderRadius: PALETTE.radius,
  backgroundColor: PALETTE.border,
  overflow: 'hidden',
};

/**
 * Genera el estilo del relleno dinamico de la barra de progreso segun el porcentaje completado.
 *
 * @param {number} porcentaje - Porcentaje completado (0 a 100).
 * @returns {CSSProperties} Estilos del relleno con color dinamico (azul corporativo si esta en progreso, verde desaturado si llego al 100%).
 */
export const progressBarFillStyle = (porcentaje) => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, porcentaje))}%`,
  backgroundColor: porcentaje >= 100 ? PALETTE.success : PALETTE.accent,
  borderRadius: PALETTE.radius,
  transition: 'width 0.3s ease',
});

/**
 * Regla CSS raw para resetear y ocultar las flechas incrementales (spinners) 
 * en inputs de tipo numerico en navegadores WebKit y Gecko.
 *
 * @type {string}
 * @example
 * // Uso en JSX mediante un tag <style>:
 * <style>{numberInputResetCSS}</style>
 */
export const numberInputResetCSS = `
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield; /* Para Firefox */
  }
`;