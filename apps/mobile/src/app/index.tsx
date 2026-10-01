import { Redirect } from 'expo-router';
import { useApp } from '../lib/app-context';
import { backendConfigured } from '../lib/supabase';

export default function Index() {
  const { onboarded, place, session } = useApp();
  if (!onboarded) return <Redirect href="/welcome" />;
  if (!place) return <Redirect href="/place" />;
  if (backendConfigured && !session) return <Redirect href="/auth" />;
  return <Redirect href="/(tabs)" />;
}
