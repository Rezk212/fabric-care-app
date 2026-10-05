import { careGroupNames, careProductOptions, format, space, type CareKind } from '@naqa/shared';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useApp } from '../lib/app-context';
import { MultiSelect, type SelectGroup } from './select';
import { Text } from './ui';

export interface CareProductsValue { detergents: string[]; detergentsOther: string; softeners: string[]; softenersOther: string }

/** Optional multi-choice lists of the detergents and softeners the user already uses at home. */
export function CareProductsPicker({ value, onChange }: { value: CareProductsValue; onChange: (v: CareProductsValue) => void }) {
  const { t, locale } = useApp();
  const groupsFor = (kind: CareKind): SelectGroup[] =>
    (['type', 'brand'] as const).map((g) => ({
      title: careGroupNames[g][locale],
      items: careProductOptions.filter((o) => o.kind === kind && o.group === g).map((o) => ({ id: o.id, label: o.name[locale] })),
    }));
  const detergentGroups = useMemo(() => groupsFor('detergent'), [locale]);
  const softenerGroups = useMemo(() => groupsFor('softener'), [locale]);

  return (
    <View style={{ gap: 12 }}>
      <Text weight="semibold">{t.profile.detergentsLabel}</Text>
      <MultiSelect placeholder={t.profile.pickDetergents} groups={detergentGroups} values={value.detergents} onChange={(ids) => onChange({ ...value, detergents: ids })}
        searchPlaceholder={t.profile.searchProduct} summary={format(t.profile.selected, { n: value.detergents.length })} doneLabel={t.profile.done}
        otherPlaceholder={t.profile.otherDetergents} otherValue={value.detergentsOther} onOtherChange={(v) => onChange({ ...value, detergentsOther: v })} />
      <Text weight="semibold">{t.profile.softenersLabel}</Text>
      <MultiSelect placeholder={t.profile.pickSofteners} groups={softenerGroups} values={value.softeners} onChange={(ids) => onChange({ ...value, softeners: ids })}
        searchPlaceholder={t.profile.searchProduct} summary={format(t.profile.selected, { n: value.softeners.length })} doneLabel={t.profile.done}
        otherPlaceholder={t.profile.otherSofteners} otherValue={value.softenersOther} onOtherChange={(v) => onChange({ ...value, softenersOther: v })} />
    </View>
  );
}
