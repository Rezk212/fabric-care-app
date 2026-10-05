import assert from 'node:assert/strict';
import { test } from 'node:test';
import { careProductAdvice, careProductOptions, products, fabricFamilies, applyDetails, fabricFromDetails, fabricOptions, colorOptions, garmentGroups, orderedFabricOptions, toAnalysis, wardrobeItems, applianceMaintenance, applianceTypes, matchChain, dictionaries, explainSymbol, explainSymbols, gulfGarments, matchMachineProgram, stainAdvice, stainGuides, symbolGuide } from './index';

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

test('wardrobe: ids unique, every label has both languages, fabrics are valid', () => {
  const ids = wardrobeItems.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const g of wardrobeItems) {
    assert.ok(nonEmpty(g.name) && g.fabrics.length > 0, g.id);
    assert.ok(garmentGroups.some((x) => x.id === g.group), g.id);
    if (g.note) assert.ok(nonEmpty(g.note), g.id);
    if (g.tipId) assert.ok(gulfGarments.some((x) => x.id === g.tipId), g.id);
  }
  assert.equal(new Set(fabricOptions.map((f) => f.id)).size, fabricOptions.length);
  for (const f of fabricOptions) assert.ok(nonEmpty(f.name) && fabricFamilies.some((x) => x.id === f.family), f.id);
  assert.equal(fabricOptions.find((f) => f.id === 'linen')?.name.ar.includes('كتان صافي'), true);
  assert.ok(fabricOptions.some((f) => f.id === 'linen_cotton'));
  for (const c of colorOptions) assert.ok(nonEmpty(c.name) && nonEmpty(c.note), c.id);
  // every group has something to pick
  for (const grp of garmentGroups) assert.ok(wardrobeItems.some((g) => g.group === grp.id), grp.id);
});

test('applyDetails only makes advice safer', () => {
  const base = toAnalysis({ fabric: 'cotton', confidence: 1, careSymbols: [], machine: { brand: null, model: null }, notes: [] });
  const dark = applyDetails(base, { garmentId: 'tshirt', colorId: 'dark' }, 'en');
  assert.ok(dark.recommendation.temperature <= 30);
  assert.ok(dark.recommendation.notes.length > base.recommendation.notes.length);
  const stained = applyDetails(base, { garmentId: 'tshirt', colorId: 'white', stains: ['coffee-tea'] }, 'en');
  assert.equal(stained.recommendation.tumbleDry, false);
  const abaya = applyDetails(toAnalysis({ fabric: 'polyester', confidence: 1, careSymbols: [], machine: { brand: null, model: null }, notes: [] }), { garmentId: 'abaya', colorId: 'dark' }, 'ar');
  assert.equal(abaya.recommendation.program, 'delicate');
  assert.equal(abaya.recommendation.tumbleDry, false);
  const leather = applyDetails(base, { garmentId: 'jacket', fabricOptionId: 'leather', colorId: 'dark' }, 'en');
  assert.equal(leather.recommendation.bleachAllowed, false);
  // never hotter than the fabric baseline
  assert.ok(applyDetails(base, { colorId: 'white' }, 'en').recommendation.temperature <= base.recommendation.temperature);
  // user-typed colour is treated cautiously
  assert.ok(applyDetails(base, { colorOther: 'turquoise' }, 'en').recommendation.temperature <= 30);
  assert.equal(fabricFromDetails({ fabricOptionId: 'satin' }), 'viscose');
  assert.equal(fabricFromDetails({}), 'unknown');
  const o = orderedFabricOptions('jeans', ['linen']);
  assert.ok(o.common.some((f) => f.id === 'denim'));
  assert.deepEqual(o.owned.map((f) => f.id), ['linen']);
  const seen = [...o.owned, ...o.common, ...o.families.flatMap((g) => g.items)].map((f) => f.id);
  assert.equal(new Set(seen).size, seen.length);
  assert.equal(seen.length, fabricOptions.length);
});

test('care product advice', () => {
  const base = { fabric: 'cotton' as const, detergents: [] as string[], softeners: [] as string[] };
  assert.deepEqual(careProductAdvice(base), []);
  const silkPowder = careProductAdvice({ ...base, fabric: 'silk', detergents: ['det_powder'] });
  assert.equal(silkPowder[0].tone, 'warn');
  assert.equal(careProductAdvice({ ...base, fabric: 'silk', detergents: ['det_delicate'] })[0].tone, 'good');
  const dark = careProductAdvice({ ...base, colorId: 'dark', detergents: ['det_powder'] });
  assert.ok(dark.some((l) => l.tone === 'warn'));
  assert.ok(careProductAdvice({ ...base, colorId: 'dark', detergents: ['det_liquid'] }).every((l) => l.tone === 'good'));
  assert.ok(careProductAdvice({ ...base, garmentId: 'sportswear', softeners: ['sof_liquid'] }).some((l) => l.tone === 'warn'));
  assert.ok(careProductAdvice({ ...base, program: 'cottons', detergents: ['det_handwash'] }).some((l) => l.tone === 'warn'));
  for (const o of careProductOptions) assert.ok(nonEmpty(o.name), o.id);
  for (const p of products) if (p.description) assert.ok(nonEmpty(p.description) && (p.usage ?? []).every(nonEmpty), p.id);
});
