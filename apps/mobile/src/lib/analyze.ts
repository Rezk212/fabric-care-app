import { baselineRecommendation, type FabricType, type GarmentAnalysis } from '@naqa/shared';

export interface AnalyzeInput {
  garmentUri?: string;
  labelUri?: string;
  machineUri?: string;
  modelNumber?: string;
}

/**
 * Phase 1 stub: the AI proxy is not connected yet, so fabric is reported as unknown with zero
 * confidence and the user confirms it on the result screen. Replaced in phase 3.
 */
export async function analyzeGarment(_input: AnalyzeInput): Promise<GarmentAnalysis> {
  return {
    fabric: 'unknown',
    confidence: 0,
    careSymbolsDetected: [],
    recommendation: baselineRecommendation('unknown'),
  };
}

export function withFabric(a: GarmentAnalysis, fabric: FabricType): GarmentAnalysis {
  return { ...a, fabric, confidence: 1, recommendation: baselineRecommendation(fabric) };
}
