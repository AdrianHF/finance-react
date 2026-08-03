// src/styles/styles.js
//
// Todos los objetos/funciones de estilo que antes vivían al final de
// App.jsx. Se movieron TAL CUAL (mismos valores, mismos nombres) para
// no alterar la apariencia actual de la app. Al vivir aquí:
//  - Dejan de recrearse en cada render de App (antes eran funciones/objetos
//    definidos en el scope del módulo igualmente, así que en ese aspecto
//    no cambia nada — pero ahora cualquier componente los puede importar
//    sin tener que pasarlos por props).
//  - Es mucho más fácil encontrarlos y ajustarlos sin tener que scrollear
//    un archivo de 700 líneas.

export const getStatusBadgeStyle = (status) => {
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

// Botón del sidebar (sin márgenes laterales para cubrir todo el ancho)
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

// Botón de texto para TODOS LOS PAGOS / MES ACTUAL
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

export const excelCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  overflow: 'hidden',
};

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

export const excelTdStyle = {
  padding: '10px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #e2e8f0',
  borderRight: '1px solid #f1f5f9',
  whiteSpace: 'nowrap',
};

export const excelTrStyle = {
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
};

export const bucketLabelStyle = {
  backgroundColor: '#f8fafc',
  padding: '2px 6px',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
  fontSize: '11px',
};

export const metricsHeaderContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '1px solid #f1f5f9',
};

export const sectionTitleStyle = {
  color: '#0f172a',
  fontSize: '15px',
  fontWeight: '600',
  letterSpacing: '0.02em',
};

export const placeholderCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px dashed #cbd5e1',
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  color: '#64748b',
};

export const tableCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

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

export const tdStyle = {
  padding: '12px 14px',
  fontSize: '13px',
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  whiteSpace: 'nowrap',
};

export const trHoverStyle = {
  transition: 'background-color 0.15s',
};

export const emptyDashStyle = {
  color: '#94a3b8',
  fontStyle: 'italic',
};

// Tooltip de información (i)
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

// Barra de progreso de pagos
export const progressBarTrackStyle = {
  width: '100%',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  overflow: 'hidden',
};

export const progressBarFillStyle = (porcentaje) => ({
  height: '100%',
  width: `${Math.min(100, Math.max(0, porcentaje))}%`,
  backgroundColor: porcentaje >= 100 ? '#16a34a' : '#3b82f6',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
});

// Truco para eliminar las flechas del input[type=number] en Chrome/Safari/
// Edge/Firefox. Antes se inyectaba con un <style> dentro del JSX del tab
// ADRIAN; se deja aquí como string para inyectarlo desde el mismo lugar
// (ver DashboardTab.jsx) sin duplicar la regla si el tab se re-renderiza.
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
