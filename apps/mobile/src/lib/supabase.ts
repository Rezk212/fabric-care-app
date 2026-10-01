import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Project URL and publishable key are public by design (safe inside an app; row-level security protects the data).
// A `.env` file can override them. The Anthropic/AI key is NOT here: it lives only as a Supabase secret.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ijlkjthvvkrtvafkekjq.supabase.co';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_i4fbF5BzpJFDcoggWzJ-nw_Bi1mmju2';

/** False only if both values are removed; the app then runs in local mode (no accounts, no AI, no saving). */
export const backendConfigured = Boolean(url && anonKey);
export const supabaseUrl = url;
export const supabaseAnonKey = anonKey;

export const supabase = backendConfigured
  ? createClient(url!, anonKey!, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, flowType: 'pkce' },
    })
  : null;
