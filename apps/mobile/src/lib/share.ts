import { APP_LINK, type Offer } from '@naqa/shared';
import { Share } from 'react-native';
import type { Dictionary, Locale } from '@naqa/shared';

/** Opens the phone's share sheet. Never throws: cancelling is not an error. */
async function send(message: string, url?: string) {
  try { await Share.share({ message: url ? `${message}\n${url}` : message }); } catch { /* ignored */ }
}

export const shareApp = (t: Dictionary) => send(t.common.shareAppText, APP_LINK || undefined);

export function shareOffer(o: Offer, locale: Locale, t: Dictionary) {
  const lines = [o.title[locale], o.subtitle?.[locale], o.advertiser ? `— ${o.advertiser}` : undefined].filter(Boolean).join('\n');
  return send(`${lines}\n\n${t.common.shareAppText}`, o.linkUrl ?? (APP_LINK || undefined));
}
