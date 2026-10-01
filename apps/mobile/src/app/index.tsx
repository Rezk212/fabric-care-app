import { Redirect } from 'expo-router';
import { useApp } from '../lib/app-context';

export default function Index() {
  const { onboarded, place } = useApp();
  if (!onboarded) return <Redirect href="/welcome" />;
  if (!place) return <Redirect href="/place" />;
  return <Redirect href="/(tabs)" />;
}
