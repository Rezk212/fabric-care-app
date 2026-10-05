import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  dictionaries, isRTL, palette,
  type ApplianceProfile, type Dictionary, type Locale, type Palette, type Place,
} from '@naqa/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { Session } from '@supabase/supabase-js';
import { useColorScheme } from 'react-native';
import { backendConfigured, supabase, supabaseAnonKey, supabaseUrl } from './supabase';

WebBrowser.maybeCompleteAuthSession();

const KEY = 'naqa.settings.v1';

export type ThemeChoice = 'auto' | 'light' | 'dark';
interface Persisted {
  locale: Locale; place: Place | null; onboarded: boolean; theme: ThemeChoice;
  /** The "complete your details" page is shown once after signing up; true after the user saved or skipped it. */
  profileDone: boolean; washer?: ApplianceProfile; dryer?: ApplianceProfile;
  /** Ids from `wardrobeItems` the user says they usually wash, plus free text. */
  wardrobe: string[]; wardrobeOther: string;
  /** Ids from `fabricOptions` the user owns, plus free text. */
  fabrics: string[]; fabricsOther: string;
}
// First launch follows the device language (Arabic or English); the user can change it any time.
const deviceLocale = (): Locale => (getLocales()[0]?.languageCode === 'en' ? 'en' : 'ar');
const defaults: Persisted = { locale: deviceLocale(), place: null, onboarded: false, theme: 'auto', profileDone: false, wardrobe: [], wardrobeOther: '', fabrics: [], fabricsOther: '' };

export type AuthError = 'invalid' | 'exists' | 'weak' | 'generic' | 'cancelled';
export type AuthResult = { ok: true; needsConfirmation?: boolean } | { ok: false; error: AuthError };

interface Ctx extends Persisted {
  ready: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  setTheme: (t: ThemeChoice) => void;
  saveProfile: (patch: Partial<Pick<Persisted, 'place' | 'washer' | 'dryer' | 'wardrobe' | 'wardrobeOther' | 'fabrics' | 'fabricsOther'>> & { done?: boolean }) => void;
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
  const system = useColorScheme();
  const dark = state.theme === 'auto' ? system === 'dark' : state.theme === 'dark';

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        // People who finished the older setup steps do not see the new details page again.
        setState({ ...defaults, ...saved, profileDone: saved.profileDone ?? Boolean(saved.place && saved.appliancesAsked) });
      })
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
    signInWithGoogle: async () => {
      // Browser-based OAuth through Supabase; works in Expo Go and in built apps.
      const redirectTo = Linking.createURL('auth-callback');
      const { data, error } = await supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } });
      if (error || !data.url) return { ok: false, error: 'generic' };
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (res.type !== 'success') return { ok: false, error: 'cancelled' };
      const code = new URL(res.url).searchParams.get('code');
      if (!code) return { ok: false, error: 'generic' };
      const { error: exchangeError } = await supabase!.auth.exchangeCodeForSession(code);
      return exchangeError ? { ok: false, error: 'generic' } : { ok: true };
    },
    signOut: async () => { await supabase?.auth.signOut(); },
    deleteAccount: async () => {
      if (!supabase) return false;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return false;
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: supabaseAnonKey!, Authorization: `Bearer ${data.session.access_token}` },
        });
        if (!res.ok) return false;
      } catch { return false; }
      await supabase.auth.signOut().catch(() => {});
      return true;
    },
    setTheme: (theme) => update({ theme }),
    saveProfile: ({ done, ...patch }) => update(done ? { ...patch, profileDone: true } : patch),
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
