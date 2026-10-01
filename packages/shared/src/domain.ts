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
}

export interface Store {
  id: string;
  name: { ar: string; en: string };
  cityId: string;
  lat: number;
  lng: number;
  productIds: string[];
  isSample: boolean;
}
