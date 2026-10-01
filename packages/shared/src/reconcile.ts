import { baselineRecommendation } from './care';
import type { FabricType, GarmentAnalysis, Temperature, WashRecommendation } from './domain';

/** Shape returned by the `analyze` edge function. */
export interface AnalyzeResponse {
  fabric: FabricType;
  confidence: number;
  careSymbols: string[];
  machine: { brand: string | null; model: string | null };
  notes: string[];
}

const TEMPS: Temperature[] = [20, 30, 40, 60, 90];
// Never recommend hotter than the baseline for these, whatever the model says.
const DELICATE: FabricType[] = ['wool', 'silk', 'cashmere', 'viscose', 'nylon'];

const snapDown = (n: number): Temperature => [...TEMPS].reverse().find((t) => t <= n) ?? 20;

/**
 * Turns the AI's facts (fabric, label symbols) into a wash recommendation. The AI never picks the
 * program: baseline care rules do, then the care label can only make advice safer or label-exact.
 */
export function toAnalysis(r: AnalyzeResponse): GarmentAnalysis {
  const rec: WashRecommendation = baselineRecommendation(r.fabric);
  const symbols = r.careSymbols.map((s) => s.toLowerCase());
  const has = (re: RegExp) => symbols.some((s) => re.test(s));

  const labelTemp = symbols
    .map((s) => /(?:wash|max)[^\d]*(\d{2})/.exec(s)?.[1])
    .find(Boolean);
  if (labelTemp) {
    const snapped = snapDown(Number(labelTemp));
    rec.temperature = DELICATE.includes(r.fabric) ? (Math.min(snapped, rec.temperature) as Temperature) : snapped;
  }
  if (has(/do not tumble|no tumble/)) rec.tumbleDry = false;
  if (has(/do not iron|no iron/)) rec.iron = 'none';
  if (has(/do not bleach|no bleach/)) rec.bleachAllowed = false;
  if (has(/hand wash/)) { rec.program = 'hand_wash'; rec.spin = 'none'; }

  rec.notes = [...rec.notes, ...r.notes];
  return { fabric: r.fabric, confidence: r.confidence, careSymbolsDetected: r.careSymbols, recommendation: rec };
}
