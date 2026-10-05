import {
  baselineRecommendation, toAnalysis,
  type AnalyzeResponse, type FabricType, type GarmentAnalysis, type UsageInfo,
} from '@naqa/shared';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { backendConfigured, supabase, supabaseAnonKey, supabaseUrl } from './supabase';

export interface AnalyzeInput {
  garmentUri?: string;
  labelUri?: string;
  /** Second label: the product label (fabric, size) and the washing label are often separate. */
  label2Uri?: string;
  machineUri?: string;
  modelNumber?: string;
}

export type AnalyzeErrorCode = 'refused' | 'rate_limited' | 'network' | 'server' | 'unauthorized' | 'quota';
export class AnalyzeError extends Error {
  constructor(public code: AnalyzeErrorCode, public usage?: UsageInfo) { super(code); }
}

/** True once the Supabase project is configured; until then the user picks the fabric by hand. */
export const aiConfigured = backendConfigured;

export interface AnalyzeResult {
  analysis: GarmentAnalysis;
  machine?: { brand: string | null; model: string | null; programs?: string[] };
  usage?: UsageInfo;
}

async function toPayload(role: 'garment' | 'label' | 'machine', uri: string) {
  // Downscale and recompress: keeps uploads small and cheap, and text on labels stays legible at 1280px.
  const img = await manipulateAsync(uri, [{ resize: { width: 1280 } }], {
    compress: 0.7, format: SaveFormat.JPEG, base64: true,
  });
  return { role, mediaType: 'image/jpeg' as const, data: img.base64 ?? '' };
}

export const unknownAnalysis = (): GarmentAnalysis => ({
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
    input.label2Uri ? toPayload('label', input.label2Uri) : null,
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
  if (res.status === 429) {
    const body = (await res.json().catch(() => null)) as { error?: string; usage?: UsageInfo } | null;
    throw new AnalyzeError(body?.error === 'quota_exceeded' ? 'quota' : 'rate_limited', body?.usage);
  }
  if (!res.ok) throw new AnalyzeError('server');
  const body = (await res.json()) as AnalyzeResponse;
  return { analysis: toAnalysis(body), machine: body.machine, usage: body.usage };
}

export function withFabric(a: GarmentAnalysis, fabric: FabricType): GarmentAnalysis {
  return { ...a, fabric, confidence: 1, recommendation: baselineRecommendation(fabric) };
}

/** Today's remaining allowance, without spending any. Null when unknown (offline, local mode). */
export async function fetchUsage(): Promise<UsageInfo | null> {
  if (!aiConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabaseAnonKey!, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'usage' }),
    });
    return res.ok ? ((await res.json()) as { usage: UsageInfo }).usage : null;
  } catch {
    return null;
  }
}
