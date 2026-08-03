// src/config/constants.js
//
// Todos los "mapeos" fijos de la app viven aquí. Antes estaban declarados
// dentro del componente App, lo que significaba que se volvían a crear en
// cada render (objetos nuevos, mismas referencias lógicas) y estaban
// mezclados con la lógica de UI. Al vivir en un módulo aparte:
//  - Se crean UNA sola vez (no en cada render).
//  - Se pueden importar desde cualquier hook o componente sin duplicarlos.
//  - Si mañana se agrega una persona/tab nueva, solo se toca este archivo.

// Nombre visible en el header según el tab activo.
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
};

// Relaciona cada tab de transacciones con su payer_loaner_id en Supabase.
export const PAYER_LOANER_MAP = {
  transacciones: 7, // Marie
  ana: 6,           // Ana
  padre: 4,         // Padre
  jefesita: 5,      // Jefesita
};

// Money bucket "personal" de cada persona (se usa para decidir el signo
// del monto: personal = positivo, gasto de proyecto = negativo).
export const PERSONAL_BUCKET_MAP = {
  transacciones: 15, // Money bucket personal de Marie
  ana: 14,           // Money bucket personal de Ana
  padre: 1,          // Money bucket personal de Padre
  jefesita: 2,       // Money bucket personal de Jefesita

};

export const PROJECT_BUCKET_MAP = {
  terrenoFelipao: 11, // Money bucket del proyecto "terreno Felipao"
  terrenoFelipe2DO: 10, // Money bucket del proyecto "terreno Felipe 2DO"
  carro: 3, // Money bucket del proyecto "carro"
  desbRefriReg: 19, // Money bucket del proyecto "desbrozadora, refrigerador, regulador"
};
export const PROJECT_TABS = [
  'terrenoFelipao',
  'terrenoFelipe2DO',
  'carro',
  'desbRefriReg',
];



// Tabs que muestran la vista de "transacciones" (todo excepto ADRIAN).
export const TRANSACTION_TABS = ['transacciones', 'ana', 'padre', 'jefesita'];

// Config inicial del ordenamiento de tablas según el tab.
export const DEFAULT_SORT_DASHBOARD = { key: 'payday_limit', direction: 'asc' };
export const DEFAULT_SORT_TRANSACTIONS = { key: 'date', direction: 'asc' };
