import { OTHER, applianceBrands, applianceTypes, space, type ApplianceProfile } from '@naqa/shared';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Select, type SelectGroup } from '../components/select';
import { BackHeader, BottomBack, Button, Card, FadeIn, Field, IconBubble, Row, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';
import { goBack } from '../lib/nav';

const NONE = '__none';
const UNSURE = '__unsure';

type Draft = { type?: string; typeOther: string; brand?: string; brandOther: string; model: string };

function toDraft(p: ApplianceProfile | undefined): Draft {
  if (!p) return { typeOther: '', brandOther: '', model: '' };
  const brandKnown = p.brand && applianceBrands.includes(p.brand);
  return {
    type: p.none ? NONE : p.typeOther ? OTHER : p.typeId,
    typeOther: p.typeOther ?? '',
    brand: p.brand ? (brandKnown ? p.brand : OTHER) : undefined,
    brandOther: p.brand && !brandKnown ? p.brand : '',
    model: p.model ?? '',
  };
}

function toProfile(d: Draft): ApplianceProfile | undefined {
  if (d.type === NONE) return { none: true };
  const brand = d.brand === OTHER ? d.brandOther.trim() : d.brand;
  const profile: ApplianceProfile = {
    typeId: d.type && d.type !== OTHER && d.type !== UNSURE ? d.type : undefined,
    typeOther: d.type === OTHER ? d.typeOther.trim() || undefined : undefined,
    brand: brand || undefined,
    model: d.model.trim() || undefined,
  };
  return profile.typeId || profile.typeOther || profile.brand || profile.model ? profile : undefined;
}

/** One-time, optional: which washer and dryer the user has. Reachable again from Settings. */
export default function Appliances() {
  const { t, locale, washer, dryer, appliancesAsked, saveAppliances } = useApp();
  const [w, setW] = useState<Draft>(() => toDraft(washer));
  const [d, setD] = useState<Draft>(() => toDraft(dryer));
  const editing = appliancesAsked;

  const groupsFor = (kind: 'washer' | 'dryer') => useMemo<SelectGroup[]>(() => [{
    items: applianceTypes.filter((a) => a.kind === kind).map((a) => ({ id: a.id, label: a.name[locale] })),
  }], [kind, locale]);
  const washerTypes = groupsFor('washer');
  const dryerTypes = groupsFor('dryer');
  const brandGroups = useMemo<SelectGroup[]>(() => [{ items: applianceBrands.map((b) => ({ id: b, label: b })) }], []);

  function finish(save: boolean) {
    saveAppliances(save ? toProfile(w) : washer, save ? toProfile(d) : dryer);
    if (editing) goBack(); else router.replace('/');
  }

  const section = (title: string, icon: 'disc' | 'wind', draft: Draft, set: (v: Draft) => void, types: SelectGroup[]) => (
    <FadeIn>
      <Card style={{ gap: space.md }}>
        <Row><IconBubble name={icon} tone={icon === 'disc' ? 'primary' : 'accent'} /><Text weight="semibold">{title}</Text></Row>
        <Select placeholder={t.appliances.pickType} groups={types} value={draft.type} onChange={(id) => set({ ...draft, type: id })}
          extraBottom={[{ id: NONE, label: t.appliances.typeNone }, { id: UNSURE, label: t.appliances.typeUnsure }]}
          otherLabel={t.manual.other} otherPlaceholder={t.appliances.otherType} otherValue={draft.typeOther} onOtherChange={(v) => set({ ...draft, typeOther: v })} />
        {draft.type !== NONE ? (
          <>
            <Select placeholder={t.appliances.pickBrand} groups={brandGroups} value={draft.brand} onChange={(id) => set({ ...draft, brand: id })}
              otherLabel={t.manual.other} otherPlaceholder={t.appliances.otherBrand} otherValue={draft.brandOther} onOtherChange={(v) => set({ ...draft, brandOther: v })} />
            <Field icon="hash" value={draft.model} onChangeText={(v) => set({ ...draft, model: v })} placeholder={t.appliances.modelPlaceholder}
              accessibilityLabel={t.appliances.modelPlaceholder} autoCapitalize="characters" autoCorrect={false} />
          </>
        ) : null}
      </Card>
    </FadeIn>
  );

  return (
    <Screen>
      {editing ? <BackHeader title={t.appliances.title} onBack={goBack} /> : null}
      <ScrollView contentContainerStyle={{ paddingVertical: space.xl, gap: space.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {!editing ? <Text variant="heading" weight="bold">{t.appliances.title}</Text> : null}
        <Text muted>{t.appliances.intro}</Text>
        {section(t.appliances.washer, 'disc', w, setW, washerTypes)}
        {section(t.appliances.dryer, 'wind', d, setD, dryerTypes)}
        <Text variant="caption" muted>{t.appliances.editHint}</Text>
      </ScrollView>
      <View style={{ gap: space.sm, paddingBottom: space.lg }}>
        <Button label={t.appliances.save} onPress={() => finish(true)} />
        {editing ? <BottomBack onPress={goBack} /> : <Button variant="quiet" label={t.appliances.skip} onPress={() => finish(false)} />}
      </View>
    </Screen>
  );
}
