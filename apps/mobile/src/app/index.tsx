import { CONSENT_VERSION } from '@naqa/shared';
import { Redirect } from 'expo-router';
import { useApp } from '../lib/app-context';
import { backendConfigured } from '../lib/supabase';

export default function Index() {
  const { onboarded, session, profileDone, consent } = useApp();
  if (!onboarded) return <Redirect href="/welcome" />;
  if (backendConfigured && !session) return <Redirect href="/auth" />;
  // Terms, privacy and disclaimer must be accepted (again whenever they change) before anything else.
  if (consent?.version !== CONSENT_VERSION) return <Redirect href="/consent" />;
  // First time after creating an account: finish location, machines and clothes (skippable).
  if (!profileDone) return <Redirect href="/profile" />;
  return <Redirect href="/(tabs)" />;
}
