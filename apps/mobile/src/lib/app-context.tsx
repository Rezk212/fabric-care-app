import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  dictionaries, isRTL, palette,
  type Dictionary, type Locale, type Palette, type Place,
} from '@naqa/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import type { Session } from '@supabase/supabase-js';
import { useColorScheme } from 'react-native';
import { backendConfigured, supabase } from './supabase';

const KEY = 'naqa.settings.v1';

interface Persisted { locale: Locale; place: Place | null; onboarded: boolean }
// First launch follows the device language (Arabic or English); the user can change it any time.
const deviceLocale = (): Locale => (getLocales()[0]?.languageCode === 'en' ? 'en' : 'ar');
const defaults: Persisted = { locale: deviceLocale(), place: null, onboarded: false };

export type AuthError = 'invalid' | 'exists' | 'weak' | 'generic';
export type AuthResult = { ok: true; needsConfirmation?: boolean } | { ok: false; error: AuthError };

interface Ctx extends Persisted {
  ready: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  t: Dictionary;
  rtl: boolean;
  colors: Palette;
  dark: boolean;
  setLocale: (l: Locale) => void;
  setPlace: (p: Place) => void;
  finishOnboarding: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(defaults);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!backendConfigured);
  const dark = useColorScheme() === 'dark';

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...defaults, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const update = useCallback((patch: Partial<Persisted>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => ({
    ...state,
    ready: ready && authReady,
    session,
    signIn: async (email, password) => {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      return error ? { ok: false, error: /invalid/i.test(error.message) ? 'invalid' : 'generic' } : { ok: true };
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase!.auth.signUp({ email, password });
      if (error) {
        const m = error.message;
        return { ok: false, error: /registered|exists/i.test(m) ? 'exists' : /password/i.test(m) ? 'weak' : 'generic' };
      }
      return { ok: true, needsConfirmation: !data.session };
    },
    signOut: async () => { await supabase?.auth.signOut(); },
    t: dictionaries[state.locale],
    rtl: isRTL(state.locale),
    colors: dark ? palette.dark : palette.light,
    dark,
    setLocale: (locale) => update({ locale }),
    setPlace: (place) => update({ place }),
    finishOnboarding: () => update({ onboarded: true }),
  }), [state, ready, authReady, session, dark, update]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
