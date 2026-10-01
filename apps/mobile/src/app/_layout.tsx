import {
  ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_600SemiBold, ReadexPro_700Bold, useFonts,
} from '@expo-google-fonts/readex-pro';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/loading-screen';
import { AppProvider, useApp } from '../lib/app-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { ready, dark, colors } = useApp();
  const [fontsLoaded] = useFonts({ ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_600SemiBold, ReadexPro_700Bold });

  // Hold the branded screen for a moment so it never just flashes.
  const [minShown, setMinShown] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMinShown(true), 1500); return () => clearTimeout(id); }, []);

  // Hand over from the native splash to our identical loading screen straight away.
  useEffect(() => { SplashScreen.hideAsync().catch(() => {}); }, []);

  if (!ready || !fontsLoaded || !minShown) return <LoadingScreen />;
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
