import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** False until `.env` is filled in; the app then runs in local mode (no accounts, no AI, no saving). */
export const backendConfigured = Boolean(url && anonKey);
export const supabaseUrl = url;
export const supabaseAnonKey = anonKey;

export const supabase = backendConfigured
  ? createClient(url!, anonKey!, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : null;
