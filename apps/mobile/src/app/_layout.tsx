import {
  IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold, useFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../lib/app-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { ready, dark, colors } = useApp();
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    if (ready && fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) return null;
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
