// ==============================================================================
// AuraLMS - Supabase Client Initialization & Guard
// Provides safe client/server runtime initialization with zero-crash fallbacks
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Checks whether valid Supabase environment variables have been provided.
 * Prevents build-time crashes on Vercel preview environments when secrets are pending.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  // Check if standard placeholder string remains
  if (
    supabaseUrl.includes('your-project') ||
    supabaseAnonKey.includes('your_supabase_anon_key')
  ) {
    return false;
  }
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
}

let cachedClient: SupabaseClient | null = null;

/**
 * Returns a singleton instance of the Supabase client if configured,
 * otherwise returns null so the data repository gracefully routes to local storage/mock state.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!cachedClient && supabaseUrl && supabaseAnonKey) {
    try {
      cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('[AuraLMS] Supabase initialization failed, falling back to mock repository:', err);
      return null;
    }
  }

  return cachedClient;
}

export const supabase = getSupabaseClient();
