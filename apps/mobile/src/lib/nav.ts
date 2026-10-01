import { router } from 'expo-router';

/** Back if there is somewhere to go back to; otherwise (deep link, restart) go to the start. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
