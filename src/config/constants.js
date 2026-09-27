/**
 * @file constants.js
 * @component Constants
 * @description Centraliza las constantes, mapas y configuraciones globales de la aplicación.
 *
 * Funcionalidades Clave:
 * - Define los nombres visibles y tipos de pestañas disponibles en la interfaz.
 * - Mapea las pestañas con sus respectivos IDs de pagadores y prestamistas en la base de datos.
 * - Establece la relación con los Money Buckets personales y de proyectos.
 * - Clasifica las pestañas según su naturaleza (proyectos o transacciones).
 * - Configura los parámetros de ordenamiento por defecto para las tablas.
 *
 * @returns {Object} Colección de constantes y mapas de configuración global.
 */

/**
 * @fileoverview Constantes y mapas de configuración global de la aplicación.
 * Centraliza los datos fijos para evitar su re-creación en cada render y permitir
 * su reutilización en Hooks, componentes y utilidades.
 */

/**
 * Identificadores válidos para las pestañas/vistas de la aplicación.
 * @typedef {'dashboard' | 'transacciones' | 'ana' | 'padre' | 'jefesita' | 'terrenoFelipao' | 'terrenoFelipe2DO' | 'carro' | 'desbRefriReg'} TabKey
 */

/**
 * Mapa de nombres visibles en la interfaz para cada pestaña.
 * @type {Record<TabKey, string>}
 */
export const TAB_NAMES = {
  dashboard: 'ADRIAN',
  transacciones: 'MARIE',
  ana: 'ANA',
  padre: 'PADRE',
  jefesita: 'JEFESITA',
  terrenoFelipao: 'TERRENO FELIPAO',
  terrenoFelipe2DO: 'TERRENO FELIPE 2DO',
  carro: 'CARRO',
  desbRefriReg: 'DESBROZADORA, REFRIGERADOR, REGULADOR',
  gastosGenerales: 'GASTOS TERRENOS'

};

/**
 * Relación entre cada pestaña de tipo cuenta/persona y su correspondiente
 * `payer_loaner_id` en la base de datos de Supabase.
 * @type {Partial<Record<TabKey, number>>}
 */
export const PAYER_LOANER_MAP = {
  transacciones: 7, // Marie
  ana: 6,           // Ana
  padre: 4,         // Padre
  jefesita: 5,      // Jefesita
};

/**
 * Identificadores de los Money Buckets personales de cada usuario.
 * Se utilizan para determinar el signo del monto (Personal = positivo, Proyecto = negativo).
 * @type {Partial<Record<TabKey, number>>}
 */
export const PERSONAL_BUCKET_MAP = {
  transacciones: 15, // Money bucket personal de Marie
  ana: 14,           // Money bucket personal de Ana
  padre: 1,          // Money bucket personal de Padre
  jefesita: 2,       // Money bucket personal de Jefesita
};

/**
 * Identificadores de los Money Buckets pertenecientes a proyectos específicos.
 * @type {Partial<Record<TabKey, number>>}
 */
export const PROJECT_BUCKET_MAP = {
  terrenoFelipao: 11,   // Money bucket del proyecto "terreno Felipao"
  terrenoFelipe2DO: 10, // Money bucket del proyecto "terreno Felipe 2DO"
  carro: 3,             // Money bucket del proyecto "carro"
  desbRefriReg: 19,     // Money bucket del proyecto "desbrozadora, refrigerador, regulador"
  gastosGenerales: 20   // Money bucket del proyecto "gastos generales"
};

/**
 * Lista de pestañas clasificadas como proyectos.
 * @type {TabKey[]}
 */
export const PROJECT_TABS = [
  'terrenoFelipao',
  'terrenoFelipe2DO',
  'carro',
  'desbRefriReg',
  'gastosGenerales'
];

/**
 * Lista de pestañas que muestran la vista detallada de transacciones individuales.
 * @type {TabKey[]}
 */
export const TRANSACTION_TABS = ['transacciones', 'ana', 'padre', 'jefesita'];

/**
 * Estructura para configurar el estado por defecto del ordenamiento de tablas.
 * @typedef {Object} SortConfig
 * @property {string} key - Clave del atributo por el cual se ordena la tabla.
 * @property {'asc' | 'desc'} direction - Dirección del ordenamiento (ascendente o descendente).
 */

/**
 * Configuración inicial de ordenamiento para la tabla del Dashboard.
 * @type {SortConfig}
 */
export const DEFAULT_SORT_DASHBOARD = { key: 'payday_limit', direction: 'asc' };

/**
 * Configuración inicial de ordenamiento para la tabla de Transacciones.
 * @type {SortConfig}
 */
export const DEFAULT_SORT_TRANSACTIONS = { key: 'date', direction: 'asc' };