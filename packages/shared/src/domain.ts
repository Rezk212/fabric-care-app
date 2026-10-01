export type Locale = 'ar' | 'en';

export type FabricType =
  | 'cotton' | 'linen' | 'wool' | 'silk' | 'polyester' | 'nylon'
  | 'denim' | 'cashmere' | 'viscose' | 'synthetic_blend' | 'unknown';

export type Temperature = 20 | 30 | 40 | 60 | 90;
export type SpinLevel = 'none' | 'low' | 'medium' | 'high';
export type IronLevel = 'none' | 'low' | 'medium' | 'high';

export interface WashRecommendation {
  /** Program name as shown on a typical machine; mapped to the real machine when its model is known. */
  program: 'delicate' | 'wool' | 'synthetics' | 'cottons' | 'quick' | 'hand_wash';
  temperature: Temperature;
  spin: SpinLevel;
  tumbleDry: boolean;
  iron: IronLevel;
  bleachAllowed: boolean;
  notes: string[];
}

export interface GarmentAnalysis {
  fabric: FabricType;
  /** 0..1. The UI must show uncertainty when below 0.7. */
  confidence: number;
  careSymbolsDetected: string[];
  recommendation: WashRecommendation;
}

export interface WashingMachine {
  brand?: string;
  model?: string;
  /** Where the identification came from. */
  source: 'photo' | 'model_number';
}

export interface Place {
  countryCode: string;
  cityId: string;
  lat?: number;
  lng?: number;
}

export interface Product {
  id: string;
  kind: 'detergent' | 'softener' | 'stain_remover' | 'delicate_wash' | 'wool_wash';
  name: { ar: string; en: string };
  forFabrics: FabricType[];
  isSample: boolean;
  /** Paid placement. Must always be labelled in the UI and never changes wash advice. */
  isSponsored?: boolean;
  /** Chains that usually stock this kind of product. Indicative, not live stock: shoppers should confirm in store. */
  chainIds?: string[];
  /** Optional photo. Only use images you own or have written permission to show (brand or store partner). */
  imageUrl?: string;
  brand?: string;
}

export interface Store {
  id: string;
  name: { ar: string; en: string };
  cityId: string;
  lat: number;
  lng: number;
  productIds: string[];
  isSample: boolean;
  isSponsored?: boolean;
}

/** Today's analysis allowance. `limit` depends on the plan; `plus` is the future paid plan. */
export interface UsageInfo { used: number; limit: number; plan: 'free' | 'plus' }

export interface Bilingual { ar: string; en: string }
