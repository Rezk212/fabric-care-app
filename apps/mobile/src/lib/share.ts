import { APP_LINK, type Dictionary, type Locale, type Offer } from '@naqa/shared';
import { Linking, Share } from 'react-native';

export interface SharePayload { message: string; url?: string }

export const appPayload = (t: Dictionary): SharePayload => ({ message: t.common.shareAppText, url: APP_LINK || undefined });

export function offerPayload(o: Offer, locale: Locale, t: Dictionary): SharePayload {
  const lines = [o.title[locale], o.subtitle?.[locale], o.advertiser ? `— ${o.advertiser}` : undefined].filter(Boolean).join('\n');
  return { message: `${lines}\n\n${t.common.shareAppText}`, url: o.linkUrl ?? (APP_LINK || undefined) };
}

const full = (p: SharePayload) => (p.url ? `${p.message}\n${p.url}` : p.message);

export type Channel = 'whatsapp' | 'telegram' | 'x' | 'facebook' | 'system';

/** Opens the chosen channel. Web share links open the installed app when there is one and the browser otherwise. */
export async function shareTo(channel: Channel, p: SharePayload) {
  const text = encodeURIComponent(full(p));
  try {
    switch (channel) {
      case 'whatsapp': return await Linking.openURL(`https://wa.me/?text=${text}`);
      case 'telegram': return await Linking.openURL(`https://t.me/share/url?url=${encodeURIComponent(p.url ?? 'https://naqa.app')}&text=${encodeURIComponent(p.message)}`);
      case 'x': return await Linking.openURL(`https://twitter.com/intent/tweet?text=${text}`);
      case 'facebook': return await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(p.url ?? 'https://naqa.app')}&quote=${encodeURIComponent(p.message)}`);
      default: await Share.share({ message: full(p) });
    }
  } catch { /* cancelled or no app: ignored */ }
}
