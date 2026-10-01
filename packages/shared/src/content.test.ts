import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applianceMaintenance, applianceTypes, matchChain, dictionaries, explainSymbol, explainSymbols, gulfGarments, matchMachineProgram, stainAdvice, stainGuides, symbolGuide } from './index';

const nonEmpty = (b: { ar: string; en: string }) => b.ar.trim().length > 0 && b.en.trim().length > 0;

test('every garment, stain and symbol has Arabic and English text', () => {
  for (const g of gulfGarments) {
    assert.ok(nonEmpty(g.name) && nonEmpty(g.fabricNote), g.id);
    assert.ok(g.tips.length >= 2 && g.tips.every(nonEmpty), g.id);
    assert.ok(g.avoid.every(nonEmpty), g.id);
  }
  for (const s of stainGuides) {
    assert.ok(nonEmpty(s.name) && s.sturdy.length >= 2 && s.delicate.length >= 1, s.id);
    assert.ok([...s.sturdy, ...s.delicate, ...s.avoid].every(nonEmpty), s.id);
  }
  assert.ok(symbolGuide.every((s) => nonEmpty(s.text)));
  assert.equal(new Set(stainGuides.map((s) => s.id)).size, stainGuides.length);
});

test('Arabic and English dictionaries have exactly the same keys', () => {
  const keys = (o: unknown, p = ''): string[] =>
    typeof o === 'object' && o !== null
      ? Object.entries(o).flatMap(([k, v]) => keys(v, p ? `${p}.${k}` : k))
      : [p];
  assert.deepEqual(keys(dictionaries.ar).sort(), keys(dictionaries.en).sort());
});

test('stain advice treats unknown fabric as delicate (the safe assumption)', () => {
  assert.equal(stainAdvice('blood', 'unknown')!.delicate, true);
  assert.equal(stainAdvice('blood', 'silk')!.delicate, true);
  assert.equal(stainAdvice('blood', 'cotton')!.delicate, false);
  assert.equal(stainAdvice('nope', 'cotton'), undefined);
  assert.match(stainAdvice('blood', 'cotton')!.avoid[0].en, /hot water/i);
});

test('care symbols are explained, specific phrases beat general ones', () => {
  assert.equal(explainSymbol('wash 30C').kind, 'wash');
  assert.equal(explainSymbol('wash 30C').level, 30);
  assert.equal(explainSymbol('Do not tumble dry').kind, 'notumble');
  assert.equal(explainSymbol('do not bleach').kind, 'nobleach');
  assert.equal(explainSymbol('non-chlorine bleach only').kind, 'bleach_oxygen');
  assert.equal(explainSymbol('bleach allowed').kind, 'bleach');
  assert.equal(explainSymbol('hand wash only').kind, 'handwash');
  assert.equal(explainSymbol('cool iron on reverse').kind, 'iron');
  assert.equal(explainSymbol('cool iron on reverse').level, 1);
  assert.equal(explainSymbol('iron 2 dots').level, 2);
  assert.equal(explainSymbol('do not dry clean').banned, true);
  assert.equal(explainSymbol('keep away from fire').kind, 'unknown');
  assert.equal(explainSymbols(['wash 30C', 'wash at 30 C', 'do not bleach']).length, 2);
});

test('machine programme matching picks the closest label on the real machine', () => {
  const panel = ['Cotton', 'Eco 40-60', 'Synthetics', 'Delicates', 'Wool/Handwash', 'Quick 15', 'Spin'];
  assert.equal(matchMachineProgram('delicate', panel), 'Delicates');
  assert.equal(matchMachineProgram('wool', panel), 'Wool/Handwash');
  assert.equal(matchMachineProgram('cottons', panel), 'Cotton');
  assert.equal(matchMachineProgram('synthetics', panel), 'Synthetics');
  assert.equal(matchMachineProgram('quick', panel), 'Quick 15');
  assert.equal(matchMachineProgram('hand_wash', ['Cotton', 'Spin']), undefined);
  assert.equal(matchMachineProgram('cottons', []), undefined);
});

test('chain matcher recognises Omani supermarket names in both languages', () => {
  assert.equal(matchChain('Lulu Hypermarket Al Khuwair')?.id, 'lulu');
  assert.equal(matchChain(undefined, 'لولو هايبرماركت')?.id, 'lulu');
  assert.equal(matchChain('Nesto Hypermarket')?.id, 'nesto');
  assert.equal(matchChain('Hyper Max')?.id, 'hypermax');
  assert.equal(matchChain('الميرة')?.id, 'almeera');
  assert.equal(matchChain('Random Mosque'), undefined);
});

test('every appliance type has Arabic and English text', () => {
  for (const a of applianceTypes) {
    assert.ok(nonEmpty(a.name) && nonEmpty(a.how) && nonEmpty(a.bestFor), a.id);
    for (const l of [...a.pros, ...a.cons]) assert.ok(nonEmpty(l), a.id);
  }
  assert.ok(applianceTypes.some((a) => a.kind === 'washer') && applianceTypes.some((a) => a.kind === 'dryer'));
});

test('every appliance type has maintenance tips in both languages', () => {
  for (const a of applianceTypes) {
    const tips = applianceMaintenance[a.id];
    assert.ok(tips && tips.length > 0 && tips.every(nonEmpty), a.id);
  }
});
