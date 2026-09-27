/**
 * @file supabaseClient.js
 * @component supabaseClient
 * @description Inicializa y exporta la instancia del cliente de Supabase para la aplicación.
 *
 * Funcionalidades Clave:
 * - Importa la función createClient desde la librería oficial de Supabase.
 * - Configura la URL del proyecto y la llave anónima pública.
 * - Exporta el cliente de Supabase configurado para su uso en otros módulos.
 *
 * @returns {Object} Instancia del cliente de Supabase configurada.
 */

import { createClient } from '@supabase/supabase-js';

// Reemplaza esto con tus credenciales reales del panel de Supabase
const supabaseUrl = 'https://qxnffgnhabyrgitqmdsy.supabase.co';
const supabaseAnonKey = 'sb_publishable_7GPN5VcnUJxi8mkGeiZh3Q_Fo3KDGhR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);