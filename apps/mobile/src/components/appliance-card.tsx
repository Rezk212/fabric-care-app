import { OTHER, applianceBrands, applianceTypes, space, type ApplianceProfile } from '@naqa/shared';
import { useMemo } from 'react';
import { View } from 'react-native';
import { useApp } from '../lib/app-context';
import { toStoredPhoto } from '../lib/photo';
import { PhotoSlot } from './photo-slot';
import { Select, type SelectGroup } from './select';
import { Card, Field, IconBubble, Row, Text } from './ui';

export const NONE = '__none';
export const UNSURE = '__unsure';

export interface Draft { type?: string; typeOther: string; brand?: string; brandOther: string; model: string; photo?: string }

export function toDraft(p: ApplianceProfile | undefined): Draft {
  if (!p) return { typeOther: '', brandOther: '', model: '' };
  const brandKnown = p.brand && applianceBrands.includes(p.brand);
  return {
    type: p.none ? NONE : p.typeOther ? OTHER : p.typeId,
    typeOther: p.typeOther ?? '',
    brand: p.brand ? (brandKnown ? p.brand : OTHER) : undefined,
    brandOther: p.brand && !brandKnown ? p.brand : '',
    model: p.model ?? '',
    photo: p.photo,
  };
}

export function toProfile(d: Draft): ApplianceProfile | undefined {
  if (d.type === NONE) return { none: true };
  const brand = d.brand === OTHER ? d.brandOther.trim() : d.brand;
  const profile: ApplianceProfile = {
    typeId: d.type && d.type !== OTHER && d.type !== UNSURE ? d.type : undefined,
    typeOther: d.type === OTHER ? d.typeOther.trim() || undefined : undefined,
    brand: brand || undefined,
    model: d.model.trim() || undefined,
    photo: d.photo,
  };
  return profile.typeId || profile.typeOther || profile.brand || profile.model || profile.photo ? profile : undefined;
}

/** Type, brand, model and an optional photo for one machine (washer or dryer). */
export function ApplianceCard({ kind, draft, onChange }: { kind: 'washer' | 'dryer'; draft: Draft; onChange: (d: Draft) => void }) {
  const { t, locale } = useApp();
  const types = useMemo<SelectGroup[]>(() => [{ items: applianceTypes.filter((a) => a.kind === kind).map((a) => ({ id: a.id, label: a.name[locale] })) }], [kind, locale]);
  const brands = useMemo<SelectGroup[]>(() => [{ items: applianceBrands.map((b) => ({ id: b, label: b })) }], []);
  const set = (patch: Partial<Draft>) => onChange({ ...draft, ...patch });
  const washer = kind === 'washer';

  return (
    <Card style={{ gap: space.md }}>
      <Row>
        <IconBubble name={washer ? 'disc' : 'wind'} tone={washer ? 'primary' : 'accent'} />
        <Text weight="semibold">{washer ? t.appliances.washer : t.appliances.dryer}</Text>
      </Row>
      <Select placeholder={t.appliances.pickType} groups={types} value={draft.type} onChange={(id) => set({ type: id })}
        accessibilityLabel={`${washer ? t.appliances.washer : t.appliances.dryer}: ${t.appliances.pickType}`}
        extraBottom={[{ id: NONE, label: t.appliances.typeNone }, { id: UNSURE, label: t.appliances.typeUnsure }]}
        otherLabel={t.manual.other} otherPlaceholder={t.appliances.otherType} otherValue={draft.typeOther} onOtherChange={(v) => set({ typeOther: v })} />
      {draft.type !== NONE ? (
        <>
          <Select placeholder={t.appliances.pickBrand} groups={brands} value={draft.brand} onChange={(id) => set({ brand: id })}
            accessibilityLabel={`${washer ? t.appliances.washer : t.appliances.dryer}: ${t.appliances.pickBrand}`}
            otherLabel={t.manual.other} otherPlaceholder={t.appliances.otherBrand} otherValue={draft.brandOther} onOtherChange={(v) => set({ brandOther: v })} />
          <Field icon="hash" value={draft.model} onChangeText={(v) => set({ model: v })} placeholder={t.appliances.modelPlaceholder}
            accessibilityLabel={`${washer ? t.appliances.washer : t.appliances.dryer}: ${t.appliances.modelPlaceholder}`} autoCapitalize="characters" autoCorrect={false} />
          <View style={{ flexDirection: 'row' }}>
            <PhotoSlot label={t.appliances.photo} hint={t.appliances.photoHint} icon="camera" height={150} uri={draft.photo}
              onChange={async (uri) => set({ photo: uri ? await toStoredPhoto(uri) : undefined })} />
          </View>
        </>
      ) : null}
    </Card>
  );
}
