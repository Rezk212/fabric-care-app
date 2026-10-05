import {
  OTHER, UNKNOWN_FABRIC, baselineRecommendation, colorOptions, fabricFromDetails, garmentGroups, orderedFabricOptions, space,
  stainGuides, wardrobeItems, type ColorId, type GarmentAnalysis, type GarmentDetails,
} from '@naqa/shared';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useApp } from '../lib/app-context';
import { Select, type SelectGroup } from './select';
import { Button, Card, Chip, Field, FadeIn, Row, Text } from './ui';

/** Questionnaire that builds a wash plan without photos: garment, fabric, colour, then optional stains. */
export function ManualForm({ onUsePhotos }: { onUsePhotos: () => void }) {
  const { t, locale, wardrobe, fabrics } = useApp();
  const [garment, setGarment] = useState<string>();
  const [garmentOther, setGarmentOther] = useState('');
  const [fabric, setFabric] = useState<string>();
  const [fabricOther, setFabricOther] = useState('');
  const [colour, setColour] = useState<string>();
  const [colourOther, setColourOther] = useState('');
  const [stains, setStains] = useState<string[]>([]);
  const [stainOther, setStainOther] = useState('');

  const garmentGroupsUi = useMemo<SelectGroup[]>(() => {
    const mine = wardrobeItems.filter((w) => wardrobe.includes(w.id)).map((w) => ({ id: w.id, label: w.name[locale] }));
    const all = garmentGroups.map((g) => ({
      title: g.name[locale],
      items: wardrobeItems.filter((w) => w.group === g.id).map((w) => ({ id: w.id, label: w.name[locale] })),
    }));
    return mine.length ? [{ title: t.appliances.myClothes, items: mine }, ...all] : all;
  }, [locale, wardrobe, t]);

  const fabricGroups = useMemo<SelectGroup[]>(() => {
    const o = orderedFabricOptions(garment === OTHER ? undefined : garment, fabrics);
    const map = (list: typeof o.common) => list.map((f) => ({ id: f.id, label: f.name[locale] }));
    return [
      ...(o.owned.length ? [{ title: t.appliances.myFabrics, items: map(o.owned) }] : []),
      ...(o.common.length ? [{ title: t.manual.commonFor, items: map(o.common) }] : []),
      ...o.families.map((g) => ({ title: g.family.name[locale], items: map(g.items) })),
    ];
  }, [garment, locale, t, fabrics]);

  const colourGroups = useMemo<SelectGroup[]>(() => [{ items: colorOptions.map((c) => ({ id: c.id, label: c.name[locale], swatch: c.swatch })) }], [locale]);

  const garmentOk = !!garment && (garment !== OTHER || garmentOther.trim().length > 0);
  const fabricOk = !!fabric && (fabric !== OTHER || fabricOther.trim().length > 0);
  const colourOk = !!colour && (colour !== OTHER || colourOther.trim().length > 0);
  const ready = garmentOk && fabricOk && colourOk;
  const toggleStain = (id: string) => setStains((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));

  function submit() {
    if (!ready) return;
    const details: GarmentDetails = {
      garmentId: garment, garmentOther: garment === OTHER ? garmentOther.trim() : undefined,
      fabricOptionId: fabric, fabricOther: fabric === OTHER ? fabricOther.trim() : undefined,
      colorId: colour === OTHER ? undefined : (colour as ColorId), colorOther: colour === OTHER ? colourOther.trim() : undefined,
      stains: stains.filter((s) => s !== OTHER), stainOther: stains.includes(OTHER) ? stainOther.trim() || t.result.otherStain : undefined,
    };
    const f = fabricFromDetails(details);
    const analysis: GarmentAnalysis = { fabric: f, confidence: f === 'unknown' ? 0 : 1, careSymbolsDetected: [], recommendation: baselineRecommendation(f) };
    router.push({ pathname: '/result', params: { analysis: JSON.stringify(analysis), details: JSON.stringify(details) } });
  }

  const step = (title: string) => <Text weight="semibold">{title}</Text>;

  return (
    <View style={{ gap: space.xl }}>
      <Text muted>{t.manual.intro}</Text>

      <FadeIn style={{ gap: space.sm }}>
        {step(t.manual.stepGarment)}
        <Select placeholder={t.manual.pickGarment} searchPlaceholder={t.manual.searchGarment} groups={garmentGroupsUi}
          value={garment} onChange={(id) => setGarment(id)}
          otherLabel={t.manual.other} otherPlaceholder={t.manual.otherGarment} otherValue={garmentOther} onOtherChange={setGarmentOther} />
      </FadeIn>

      {garmentOk ? (
        <FadeIn style={{ gap: space.sm }}>
          {step(t.manual.stepFabric)}
          <Select placeholder={t.manual.pickFabric} searchPlaceholder={t.profile.searchFabric} groups={fabricGroups} value={fabric} onChange={setFabric}
            extraBottom={[{ id: UNKNOWN_FABRIC, label: t.manual.dontKnow }]}
            otherLabel={t.manual.other} otherPlaceholder={t.manual.otherFabric} otherValue={fabricOther} onOtherChange={setFabricOther} />
          <Card style={{ gap: space.sm }}>
            <Text variant="caption" muted>{t.manual.fabricNote}</Text>
            <Button variant="quiet" icon="tag" label={t.manual.readLabel} onPress={onUsePhotos} />
          </Card>
        </FadeIn>
      ) : null}

      {garmentOk && fabricOk ? (
        <FadeIn style={{ gap: space.sm }}>
          {step(t.manual.stepColour)}
          <Select placeholder={t.manual.pickColour} groups={colourGroups} value={colour} onChange={setColour}
            otherLabel={t.manual.other} otherPlaceholder={t.manual.otherColour} otherValue={colourOther} onOtherChange={setColourOther} />
        </FadeIn>
      ) : null}

      {garmentOk && fabricOk && colourOk ? (
        <FadeIn style={{ gap: space.sm }}>
          {step(t.manual.stepStains)}
          <Text variant="caption" muted>{t.manual.stainsHint}</Text>
          <Row style={{ flexWrap: 'wrap' }}>
            {stainGuides.map((s) => <Chip key={s.id} label={s.name[locale]} selected={stains.includes(s.id)} onPress={() => toggleStain(s.id)} />)}
            <Chip label={t.manual.other} selected={stains.includes(OTHER)} onPress={() => toggleStain(OTHER)} />
          </Row>
          {stains.includes(OTHER) ? (
            <Field icon="edit-3" value={stainOther} onChangeText={setStainOther} placeholder={t.manual.otherStain} accessibilityLabel={t.manual.otherStain} />
          ) : null}
        </FadeIn>
      ) : null}

      <View style={{ gap: space.sm }}>
        {!ready ? <Text variant="caption" muted>{t.manual.needMore}</Text> : null}
        <Button icon="check-circle" label={t.manual.submit} onPress={submit} disabled={!ready} />
      </View>
    </View>
  );
}
