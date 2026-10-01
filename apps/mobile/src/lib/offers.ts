import { sampleOffers, type Offer } from '@naqa/shared';
import { supabase } from './supabase';

/** Show the built-in sample offers while the dashboard has none. Set to false once real offers are live. */
const SHOW_SAMPLES_WHEN_EMPTY = true;

/** Live offers from the dashboard (Supabase `offers` table); samples when there are none or it is unreachable. */
export async function fetchOffers(): Promise<Offer[]> {
  if (!supabase) return sampleOffers;
  try {
    const { data, error } = await supabase.from('offers').select('*').order('sort').order('created_at', { ascending: false }).limit(12);
    if (error) return sampleOffers;
    const rows = (data ?? []).map((r): Offer => ({
      id: r.id,
      category: r.category,
      title: { ar: r.title_ar, en: r.title_en },
      subtitle: r.subtitle_ar || r.subtitle_en ? { ar: r.subtitle_ar ?? r.subtitle_en, en: r.subtitle_en ?? r.subtitle_ar } : undefined,
      badge: r.badge_ar || r.badge_en ? { ar: r.badge_ar ?? r.badge_en, en: r.badge_en ?? r.badge_ar } : undefined,
      advertiser: r.advertiser ?? undefined,
      linkUrl: r.link_url ?? undefined,
    }));
    return rows.length > 0 || !SHOW_SAMPLES_WHEN_EMPTY ? rows : sampleOffers;
  } catch {
    return sampleOffers;
  }
}
