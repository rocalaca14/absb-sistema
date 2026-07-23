import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { logger } from '@/core/logger/logger';

import type { Database } from './types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient<Database> | null = null;

if (url && anonKey) {
  try {
    client = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'absb.auth',
      },
    });
    logger.info('Cliente Supabase inicializado');
  } catch (error) {
    logger.error('Falha ao inicializar cliente Supabase', { error });
    client = null;
  }
} else {
  logger.warn(
    'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env',
  );
}

export const supabase: SupabaseClient<Database> | null = client;
export const isSupabaseConfigured: boolean = client !== null;
