/**
 * @file dateUtils.js
 * @component dateUtils
 * @description Utilidades para la manipulación y formato de fechas en selectores de meses y años.
 *
 * Funcionalidades Clave:
 * - Obtiene el mes actual en formato "YYYY-MM"
 * - Construye un listado estático de años disponibles
 * - Genera nombres de meses en español para interfaces de usuario
 * - Crea opciones dinámicas de meses basadas en un rango histórico
 *
 * @returns {Object} Conjunto de funciones utilitarias para fechas
 *
 * @public:  getCurrentMonthString, buildYearOptions, buildMonthNames, buildMonthOptions
 */

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
export function buildYearOptions() {
  return [2023, 2024, 2025, 2026, 2027];
}

export function buildMonthNames() {
  return [
    { value: '01', label: 'ENERO' },
    { value: '02', label: 'FEBRERO' },
    { value: '03', label: 'MARZO' },
    { value: '04', label: 'ABRIL' },
    { value: '05', label: 'MAYO' },
    { value: '06', label: 'JUNIO' },
    { value: '07', label: 'JULIO' },
    { value: '08', label: 'AGOSTO' },
    { value: '09', label: 'SEPTIEMBRE' },
    { value: '10', label: 'OCTUBRE' },
    { value: '11', label: 'NOVIEMBRE' },
    { value: '12', label: 'DICIEMBRE' }
  ];
}

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

