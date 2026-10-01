import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toAnalysis, type AnalyzeResponse } from './reconcile';

const base: AnalyzeResponse = {
  fabric: 'cotton', confidence: 0.9, careSymbols: [], machine: { brand: null, model: null }, notes: [],
};

test('cotton uses baseline when label is silent', () => {
  const a = toAnalysis(base);
  assert.equal(a.recommendation.temperature, 40);
  assert.equal(a.recommendation.program, 'cottons');
});

test('label temperature is honoured for sturdy fabrics', () => {
  const a = toAnalysis({ ...base, careSymbols: ['wash 60C'] });
  assert.equal(a.recommendation.temperature, 60);
});

test('delicate fabrics are never hotter than baseline', () => {
  const a = toAnalysis({ ...base, fabric: 'silk', careSymbols: ['wash 60C'] });
  assert.equal(a.recommendation.temperature, 30);
});

test('label prohibitions apply', () => {
  const a = toAnalysis({ ...base, careSymbols: ['do not tumble dry', 'do not iron', 'do not bleach'] });
  assert.equal(a.recommendation.tumbleDry, false);
  assert.equal(a.recommendation.iron, 'none');
  assert.equal(a.recommendation.bleachAllowed, false);
});

test('hand wash label forces hand wash program', () => {
  const a = toAnalysis({ ...base, fabric: 'wool', careSymbols: ['hand wash only'] });
  assert.equal(a.recommendation.program, 'hand_wash');
  assert.equal(a.recommendation.spin, 'none');
});

test('unknown fabric stays conservative', () => {
  const a = toAnalysis({ ...base, fabric: 'unknown', confidence: 0 });
  assert.equal(a.recommendation.temperature, 30);
});
