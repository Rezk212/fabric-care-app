import type { FabricType, WashRecommendation } from './domain';

// Baseline rules used when AI analysis is unavailable and to sanity-check AI output.
const rules: Record<FabricType, WashRecommendation> = {
  cotton: { program: 'cottons', temperature: 40, spin: 'high', tumbleDry: true, iron: 'high', bleachAllowed: false, notes: [] },
  linen: { program: 'cottons', temperature: 40, spin: 'medium', tumbleDry: false, iron: 'high', bleachAllowed: false, notes: [] },
  wool: { program: 'wool', temperature: 30, spin: 'low', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  cashmere: { program: 'hand_wash', temperature: 30, spin: 'none', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  silk: { program: 'delicate', temperature: 30, spin: 'low', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  polyester: { program: 'synthetics', temperature: 40, spin: 'medium', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  nylon: { program: 'synthetics', temperature: 30, spin: 'low', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  denim: { program: 'cottons', temperature: 30, spin: 'medium', tumbleDry: false, iron: 'medium', bleachAllowed: false, notes: [] },
  viscose: { program: 'delicate', temperature: 30, spin: 'low', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  synthetic_blend: { program: 'synthetics', temperature: 40, spin: 'medium', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
  unknown: { program: 'delicate', temperature: 30, spin: 'low', tumbleDry: false, iron: 'low', bleachAllowed: false, notes: [] },
};

export function baselineRecommendation(fabric: FabricType): WashRecommendation {
  return { ...rules[fabric], notes: [...rules[fabric].notes] };
}
