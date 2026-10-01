import {
  baselineRecommendation, toAnalysis,
  type AnalyzeResponse, type FabricType, type GarmentAnalysis,
} from '@naqa/shared';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

export interface AnalyzeInput {
  garmentUri?: string;
  labelUri?: string;
  machineUri?: string;
  modelNumber?: string;
}

export type AnalyzeErrorCode = 'refused' | 'rate_limited' | 'network' | 'server';
export class AnalyzeError extends Error {
  constructor(public code: AnalyzeErrorCode) { super(code); }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase project is configured; until then the user picks the fabric by hand. */
export const aiConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function toPayload(role: 'garment' | 'label' | 'machine', uri: string) {
  // Downscale and recompress: keeps uploads small and cheap, and text on labels stays legible at 1280px.
  const img = await manipulateAsync(uri, [{ resize: { width: 1280 } }], {
    compress: 0.7, format: SaveFormat.JPEG, base64: true,
  });
  return { role, mediaType: 'image/jpeg' as const, data: img.base64 ?? '' };
}

const unknownAnalysis = (): GarmentAnalysis => ({
  fabric: 'unknown', confidence: 0, careSymbolsDetected: [], recommendation: baselineRecommendation('unknown'),
});

export async function analyzeGarment(input: AnalyzeInput): Promise<GarmentAnalysis> {
  if (!aiConfigured) return unknownAnalysis();

  const images = await Promise.all([
    input.garmentUri ? toPayload('garment', input.garmentUri) : null,
    input.labelUri ? toPayload('label', input.labelUri) : null,
    input.machineUri ? toPayload('machine', input.machineUri) : null,
  ]).then((list) => list.filter((i): i is NonNullable<typeof i> => i !== null));

  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ images, modelNumber: input.modelNumber }),
    });
  } catch {
    throw new AnalyzeError('network');
  }

  if (res.status === 422) throw new AnalyzeError('refused');
  if (res.status === 429) throw new AnalyzeError('rate_limited');
  if (!res.ok) throw new AnalyzeError('server');
  return toAnalysis((await res.json()) as AnalyzeResponse);
}

export function withFabric(a: GarmentAnalysis, fabric: FabricType): GarmentAnalysis {
  return { ...a, fabric, confidence: 1, recommendation: baselineRecommendation(fabric) };
}
