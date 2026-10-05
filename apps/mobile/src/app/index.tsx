import { Redirect } from 'expo-router';
import { useApp } from '../lib/app-context';
import { backendConfigured } from '../lib/supabase';

export default function Index() {
  const { onboarded, session, profileDone } = useApp();
  if (!onboarded) return <Redirect href="/welcome" />;
  if (backendConfigured && !session) return <Redirect href="/auth" />;
  // First time after creating an account: finish location, machines and clothes (skippable).
  if (!profileDone) return <Redirect href="/profile" />;
  return <Redirect href="/(tabs)" />;
}
