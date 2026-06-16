// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Reemplaza esto con tus credenciales reales del panel de Supabase
const supabaseUrl = 'https://qxnffgnhabyrgitqmdsy.supabase.co';
const supabaseAnonKey = 'sb_publishable_7GPN5VcnUJxi8mkGeiZh3Q_Fo3KDGhR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);