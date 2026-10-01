import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  dictionaries, isRTL, palette,
  type Dictionary, type Locale, type Palette, type Place,
} from '@naqa/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

const KEY = 'naqa.settings.v1';

interface Persisted { locale: Locale; place: Place | null; onboarded: boolean }
const defaults: Persisted = { locale: 'ar', place: null, onboarded: false };

interface Ctx extends Persisted {
  ready: boolean;
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
  const dark = useColorScheme() === 'dark';

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...defaults, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => setReady(true));
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
    ready,
    t: dictionaries[state.locale],
    rtl: isRTL(state.locale),
    colors: dark ? palette.dark : palette.light,
    dark,
    setLocale: (locale) => update({ locale }),
    setPlace: (place) => update({ place }),
    finishOnboarding: () => update({ onboarded: true }),
  }), [state, ready, dark, update]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
