import type { Bilingual } from '../domain';

export interface Chain {
  id: string;
  name: Bilingual;
  /** Case-insensitive pattern matched against OpenStreetMap name / brand / Arabic name tags. */
  match: RegExp;
}

/** Trusted supermarket and hypermarket chains operating in Oman. Branch locations come live from OpenStreetMap. */
export const omanChains: Chain[] = [
  { id: 'lulu', name: { ar: 'لولو هايبرماركت', en: 'Lulu Hypermarket' }, match: /lulu|لولو/i },
  { id: 'hypermax', name: { ar: 'هايبرماكس', en: 'Hypermax' }, match: /hyper\s?max|هايبر\s?ماكس/i },
  { id: 'nesto', name: { ar: 'نيستو هايبرماركت', en: 'Nesto Hypermarket' }, match: /nesto|نيستو/i },
  { id: 'makkah', name: { ar: 'مكة هايبرماركت', en: 'Makkah Hypermarket' }, match: /makkah|mecca|مكة|مكه/i },
  { id: 'almeera', name: { ar: 'الميرة هايبرماركت', en: 'Al Meera Hypermarket' }, match: /al[\s-]?meera|الميرة/i },
  { id: 'carrefour', name: { ar: 'كارفور', en: 'Carrefour' }, match: /carrefour|كارفور/i },
  { id: 'sultan', name: { ar: 'مركز السلطان', en: 'The Sultan Center' }, match: /sultan\s?center|مركز\s?السلطان/i },
  { id: 'ramez', name: { ar: 'رامز', en: 'Ramez' }, match: /ramez|رامز/i },
];

/** Which chain a place belongs to, judged from its name tags. */
export function matchChain(...labels: (string | undefined)[]): Chain | undefined {
  const text = labels.filter(Boolean).join(' ');
  return omanChains.find((c) => c.match.test(text));
}
