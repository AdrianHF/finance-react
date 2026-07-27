// src/utils/dateUtils.js
//
// Funciones puras relacionadas a fechas. Al ser funciones puras (mismo
// input -> mismo output, sin tocar estado de React) se pueden probar
// de forma aislada y reutilizar en cualquier parte de la app.

/**
 * Regresa el mes actual en formato "YYYY-MM", usado como valor por
 * defecto del selector de mes y para saber si estamos viendo "MES ACTUAL".
 */
export function getCurrentMonthString() {
  const ahora = new Date();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  return `${ahora.getFullYear()}-${mm}`;
}

/**
 * Construye las opciones del <select> de meses.
 *
 * ⚠️ NOTA DE MANTENIMIENTO (ver informe): en el código original la fecha
 * de arranque estaba fija en "new Date(2027, 8, 1)" (septiembre 2027).
 * Esto es una fecha "quemada" (hardcoded) que en algún momento va a
 * quedar desactualizada o va a limitar los meses disponibles hacia
 * adelante. Se deja documentado el comportamiento original tal cual
 * (no se cambia el estilo/funcionamiento actual), pero se recomienda
 * mover ese valor a una constante configurable o calcularlo en base a
 * la fecha actual (por ejemplo: "N meses antes y después de hoy").
 */
export function buildMonthOptions() {
  const opciones = [];
  const fechaInicio = new Date(2027, 8, 1); // ver nota arriba
  const TOTAL_MESES = 60;

  for (let i = 0; i < TOTAL_MESES; i++) {
    const y = fechaInicio.getFullYear();
    const m = String(fechaInicio.getMonth() + 1).padStart(2, '0');
    const nombreMes = new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric',
    }).format(fechaInicio);

    opciones.push({ value: `${y}-${m}`, label: nombreMes.toUpperCase() });
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  }

  return opciones;
}

