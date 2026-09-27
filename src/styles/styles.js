/**
 * @file styles.js
 * @component StylesModule
 * @description Modulo centralizado de estilos CSS-in-JS y funciones generadoras de diseño para la aplicación.
 *
 * Funcionalidades Clave:
 * - Proporciona objetos de estilos estáticos para componentes comunes como tarjetas, tablas y botones.
 * - Incluye funciones generadoras para estilos dinámicos basados en estados o porcentajes.
 * - Centraliza esquemas visuales consistentes para elementos como badges, barras de progreso y tipografías.
 * - Define inyecciones de CSS global para utilidades específicas como el reseteo de inputs numéricos.
 *
 * @returns {Object} Colección de objetos de estilo y funciones generadoras de CSS-in-JS.
 */

/**
 * @fileoverview Modulo de estilos centralizados de la aplicacion (CSS-in-JS).
 * Contiene objetos de estilos en linea, funciones generadoras de estilo dinámico 
 * e inyecciones CSS globales para asegurar consistencia visual y reutilizacion.
 */

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
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };
  switch (status) {
    case 'PAGADO':
      return { ...baseBadgeStyle, backgroundColor: '#b5e2c5', color: '#33704a' };
    case 'POR PAGAR':
      return { ...baseBadgeStyle, backgroundColor: '#e9e4ab', color: '#946128' };
    case 'NO DISPONIBLE AUN':
      return { ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#475569' };
    case 'PRODUCTO INACTIVO':
      return { ...baseBadgeStyle, backgroundColor: '#e2e8f0', color: '#94a3b8' };
    case 'NO APLICA':
      return { ...baseBadgeStyle, backgroundColor: '#cbd5e1', color: '#475569', fontStyle: 'italic' };
    default:
      return { ...baseBadgeStyle, backgroundColor: '#fef2f2', color: '#991b1b' };
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
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  fontWeight: isActive ? '600' : 'normal',
  transition: 'background 0.2s',
  margin: 0,
  display: 'block',
});

/**
 * Estilo para los botones de navegacion de Buckets/Proyectos en la barra lateral.
 *
 * @param {boolean} isActive - Indica si la pestaña del bucket esta activa.
 * @returns {CSSProperties} Estilos con esquema de color naranja/coral.
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
  backgroundColor: isActive ? '#e9925f' : '#e4a580',
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
  color: isActive ? '#ffffff' : '#cbd5e1',
  fontSize: '10px',
  fontWeight: isActive ? '700' : '400',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
});

/**
 * Estilo para botones de texto o toggle (ej: "TODOS LOS PAGOS" vs "MES ACTUAL").
 *
 * @param {boolean} isHighlighted - Controla si el boton se muestra resaltado o neutro.
 * @returns {CSSProperties} Estilos para botones de alternancia.
 */
export const textButtonStyle = (isHighlighted) => ({
  backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  color: isHighlighted ? '#1e3a8a' : '#64748b',
  border: isHighlighted ? '1px solid #3b82f6' : '1px solid transparent',
  borderRadius: '8px',
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
  color: '#475569',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  cursor: 'pointer',
  outline: 'none',
};

/**
 * Contenedor tipo tarjeta para las tablas con vista inspirada en hojas de calculo.
 * @type {CSSProperties}
 */
export const excelCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
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
  color: '#475569',
  borderBottom: '2px solid #cbd5e1',
  borderRight: '1px solid #e2e8f0',
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
  color: '#334155',
  borderBottom: '1px solid #e2e8f0',
  borderRight: '1px solid #f1f5f9',
  whiteSpace: 'nowrap',
};

/**
 * Estilos base para las filas (`<tr>`) en vistas tipo Excel.
 * @type {CSSProperties}
 */
export const excelTrStyle = {
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
};

/**
 * Estilos para etiquetas pequenas de Buckets / Categorias monetarias.
 * @type {CSSProperties}
 */
export const bucketLabelStyle = {
  backgroundColor: '#f8fafc',
  padding: '2px 6px',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
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
  borderBottom: '1px solid #f1f5f9',
};

/**
 * Estilos para titulos de seccion dentro del dashboard.
 * @type {CSSProperties}
 */
export const sectionTitleStyle = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.02em',
};

/**
 * Estilos para tarjetas en estado vacio o sin datos cargados (Placeholders).
 * @type {CSSProperties}
 */
export const placeholderCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px dashed #cbd5e1',
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  color: '#64748b',
};

/**
 * Contenedor estandar con sombra ligera para tarjetas de tablas.
 * @type {CSSProperties}
 */
export const tableCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
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
  color: '#64748b',
  textTransform: 'uppercase',
  textAlign: 'left',
  borderBottom: '2px solid #e2e8f0',
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
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
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
  color: '#94a3b8',
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
  backgroundColor: '#cbd5e1',
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
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  overflow: 'hidden',
};

/**
 * Genera el estilo del relleno dinamico de la barra de progreso segun el porcentaje completado.
 *
 * @param {number} porcentaje - Porcentaje completado (0 a 100).
 * @returns {CSSProperties} Estilos del relleno con color dinamico (azul si esta en progreso, verde si llego al 100%).
 */
export const progressBarFillStyle = (porcentaje) => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, porcentaje))}%`,
  backgroundColor: porcentaje >= 100 ? '#16a34a' : '#3b82f6',
  borderRadius: '4px',
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