import { tours } from '@naqa/shared';
import { router } from 'expo-router';
import { TourPlayer } from '../components/tour-player';
import { useApp } from '../lib/app-context';

/** First-run walkthrough, shown once after sign-up and the details page. */
export default function Tour() {
  const { finishIntro } = useApp();
  return <TourPlayer slides={tours.intro} onClose={(completed) => { finishIntro(completed); router.replace('/'); }} />;
}
