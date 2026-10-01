import {
  baselineRecommendation, toAnalysis,
  type AnalyzeResponse, type FabricType, type GarmentAnalysis,
} from '@naqa/shared';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { backendConfigured, supabase, supabaseAnonKey, supabaseUrl } from './supabase';

export interface AnalyzeInput {
  garmentUri?: string;
  labelUri?: string;
  machineUri?: string;
  modelNumber?: string;
}

export type AnalyzeErrorCode = 'refused' | 'rate_limited' | 'network' | 'server' | 'unauthorized';
export class AnalyzeError extends Error {
  constructor(public code: AnalyzeErrorCode) { super(code); }
}

/** True once the Supabase project is configured; until then the user picks the fabric by hand. */
export const aiConfigured = backendConfigured;

export interface AnalyzeResult {
  analysis: GarmentAnalysis;
  machine?: { brand: string | null; model: string | null };
}

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

export async function analyzeGarment(input: AnalyzeInput): Promise<AnalyzeResult> {
  if (!aiConfigured || !supabase) return { analysis: unknownAnalysis() };
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new AnalyzeError('unauthorized');

  const images = await Promise.all([
    input.garmentUri ? toPayload('garment', input.garmentUri) : null,
    input.labelUri ? toPayload('label', input.labelUri) : null,
    input.machineUri ? toPayload('machine', input.machineUri) : null,
  ]).then((list) => list.filter((i): i is NonNullable<typeof i> => i !== null));

  let res: Response;
  try {
    res = await fetch(`${supabaseUrl}/functions/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabaseAnonKey!, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ images, modelNumber: input.modelNumber }),
    });
  } catch {
    throw new AnalyzeError('network');
  }

  if (res.status === 401) throw new AnalyzeError('unauthorized');
  if (res.status === 422) throw new AnalyzeError('refused');
  if (res.status === 429) throw new AnalyzeError('rate_limited');
  if (!res.ok) throw new AnalyzeError('server');
  const body = (await res.json()) as AnalyzeResponse;
  return { analysis: toAnalysis(body), machine: body.machine };
}

export function withFabric(a: GarmentAnalysis, fabric: FabricType): GarmentAnalysis {
  return { ...a, fabric, confidence: 1, recommendation: baselineRecommendation(fabric) };
}
