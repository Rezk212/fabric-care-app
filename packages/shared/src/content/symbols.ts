import type { Bilingual } from '../domain';

export type SymbolKind =
  | 'wash' | 'gentle' | 'handwash' | 'nowash'
  | 'bleach' | 'bleach_oxygen' | 'nobleach'
  | 'tumble' | 'notumble'
  | 'iron' | 'noiron'
  | 'dryclean' | 'nodryclean'
  | 'linedry' | 'dripdry' | 'dryflat' | 'shade' | 'nowring' | 'insideout'
  | 'unknown';

export interface SymbolInfo {
  kind: SymbolKind;
  /** Wash temperature in °C, or iron dots (1-3). */
  level?: number;
  /** Drawn with a cross over it. */
  banned: boolean;
  text: Bilingual;
}

const IRON_TEXT: Record<number, Bilingual> = {
  1: { ar: 'كيّ على حرارة منخفضة (حتى 110°م)', en: 'Iron on low heat (up to 110°C)' },
  2: { ar: 'كيّ على حرارة متوسطة (حتى 150°م)', en: 'Iron on medium heat (up to 150°C)' },
  3: { ar: 'كيّ على حرارة عالية (حتى 200°م)', en: 'Iron on high heat (up to 200°C)' },
};

const make = (kind: SymbolKind, text: Bilingual, banned = false, level?: number): SymbolInfo => ({ kind, text, banned, level });

/** Turns one raw label phrase from the AI (English, free text) into a known symbol, or an 'unknown' with the raw text. */
export function explainSymbol(raw: string): SymbolInfo {
  const s = raw.toLowerCase().trim();
  const temp = /(\d{2})\s*(?:°|º|deg|degrees|c\b)/.exec(s)?.[1] ?? /\b(30|40|50|60|70|95)\b/.exec(s)?.[1];

  if (/(do not|don'?t|no)\s+(machine\s+)?wash/.test(s)) return make('nowash', { ar: 'لا تُغسل بالماء', en: 'Do not wash' }, true);
  if (/hand\s*wash/.test(s)) return make('handwash', { ar: 'غسيل يدوي فقط', en: 'Hand wash only' });
  if (/(do not|don'?t|no)\s+(use\s+)?bleach/.test(s)) return make('nobleach', { ar: 'لا تستخدم المبيّض', en: 'Do not bleach' }, true);
  if (/(non[- ]?chlorine|oxygen)\s+bleach|bleach.*(non[- ]?chlorine|oxygen)/.test(s)) return make('bleach_oxygen', { ar: 'مبيّض غير كلوري فقط', en: 'Non-chlorine bleach only' });
  if (/bleach/.test(s)) return make('bleach', { ar: 'يُسمح بالمبيّض', en: 'Bleach allowed' });
  if (/(do not|don'?t|no)\s+tumble/.test(s)) return make('notumble', { ar: 'لا تجفّفها في المجفف الآلي', en: 'Do not tumble dry' }, true);
  if (/tumble/.test(s)) return make('tumble', { ar: 'يُسمح بالتجفيف الآلي', en: 'Tumble dry allowed' });
  if (/(do not|don'?t|no)\s+iron/.test(s)) return make('noiron', { ar: 'لا تكوِها', en: 'Do not iron' }, true);
  if (/(do not|don'?t|no)\s+dry\s*clean/.test(s)) return make('nodryclean', { ar: 'لا تنظّف جافًا', en: 'Do not dry clean' }, true);
  if (/dry\s*clean|professional/.test(s)) return make('dryclean', { ar: 'تنظيف جاف مهني', en: 'Dry clean (professional)' });
  if (/iron/.test(s)) {
    const dots = /(\d)\s*dot/.exec(s)?.[1];
    const level = dots ? Number(dots) : /low|cool/.test(s) ? 1 : /high/.test(s) ? 3 : /medium|warm/.test(s) ? 2 : 2;
    return make('iron', IRON_TEXT[Math.min(3, Math.max(1, level))], false, Math.min(3, Math.max(1, level)));
  }
  if (/(do not|don'?t|no)\s+wring/.test(s)) return make('nowring', { ar: 'لا تعصرها', en: 'Do not wring' }, true);
  if (/drip/.test(s)) return make('dripdry', { ar: 'جفّفها بالتنقيط دون عصر', en: 'Drip dry, do not wring' });
  if (/flat/.test(s)) return make('dryflat', { ar: 'جفّفها مفروشة أفقيًا', en: 'Dry flat' });
  if (/shade/.test(s)) return make('shade', { ar: 'جفّفها في الظل', en: 'Dry in the shade' });
  if (/line\s*dry|hang/.test(s)) return make('linedry', { ar: 'انشرها للتجفيف', en: 'Line dry' });
  if (/inside\s*out/.test(s)) return make('insideout', { ar: 'اغسلها مقلوبة', en: 'Wash inside out' });
  if (/gentle|delicate|mild/.test(s) && !temp) return make('gentle', { ar: 'برنامج لطيف', en: 'Gentle cycle' });
  if (/wash|machine/.test(s) || temp) {
    const t = temp ? Number(temp) : undefined;
    return make('wash', {
      ar: t ? `غسيل آلي حتى ${t}°م` : 'غسيل آلي',
      en: t ? `Machine wash up to ${t}°C` : 'Machine wash',
    }, false, t);
  }
  return make('unknown', { ar: raw, en: raw });
}

/** De-duplicated, in the order read. */
export function explainSymbols(raw: string[]): SymbolInfo[] {
  const seen = new Set<string>();
  const out: SymbolInfo[] = [];
  for (const r of raw) {
    const info = explainSymbol(r);
    const key = `${info.kind}:${info.level ?? ''}:${info.kind === 'unknown' ? info.text.en : ''}`;
    if (!seen.has(key)) { seen.add(key); out.push(info); }
  }
  return out;
}

/** The standard symbols, for the offline guide screen. */
export const symbolGuide: SymbolInfo[] = [
  make('wash', { ar: 'غسيل آلي حتى 30°م', en: 'Machine wash up to 30°C' }, false, 30),
  make('wash', { ar: 'غسيل آلي حتى 40°م', en: 'Machine wash up to 40°C' }, false, 40),
  make('wash', { ar: 'غسيل آلي حتى 60°م', en: 'Machine wash up to 60°C' }, false, 60),
  make('gentle', { ar: 'برنامج لطيف (الخط تحت الرمز)', en: 'Gentle cycle (the line under the symbol)' }),
  make('handwash', { ar: 'غسيل يدوي فقط', en: 'Hand wash only' }),
  make('nowash', { ar: 'لا تُغسل بالماء', en: 'Do not wash' }, true),
  make('bleach', { ar: 'يُسمح بالمبيّض', en: 'Bleach allowed' }),
  make('bleach_oxygen', { ar: 'مبيّض غير كلوري فقط', en: 'Non-chlorine bleach only' }),
  make('nobleach', { ar: 'لا تستخدم المبيّض', en: 'Do not bleach' }, true),
  make('tumble', { ar: 'يُسمح بالتجفيف الآلي', en: 'Tumble dry allowed' }),
  make('notumble', { ar: 'لا تجفّفها في المجفف الآلي', en: 'Do not tumble dry' }, true),
  make('iron', IRON_TEXT[1], false, 1),
  make('iron', IRON_TEXT[2], false, 2),
  make('iron', IRON_TEXT[3], false, 3),
  make('noiron', { ar: 'لا تكوِها', en: 'Do not iron' }, true),
  make('dryclean', { ar: 'تنظيف جاف مهني', en: 'Dry clean (professional)' }),
  make('nodryclean', { ar: 'لا تنظّف جافًا', en: 'Do not dry clean' }, true),
  make('linedry', { ar: 'انشرها للتجفيف', en: 'Line dry' }),
  make('dripdry', { ar: 'جفّفها بالتنقيط دون عصر', en: 'Drip dry' }),
  make('dryflat', { ar: 'جفّفها مفروشة أفقيًا', en: 'Dry flat' }),
];
