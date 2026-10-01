import type { Locale } from '../domain';
import { ar } from './ar';
import { en, type Dictionary } from './en';

export const dictionaries: Record<Locale, Dictionary> = { ar, en };
export const isRTL = (locale: Locale) => locale === 'ar';

/** Replace `{name}` placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));
}

export type { Dictionary };
