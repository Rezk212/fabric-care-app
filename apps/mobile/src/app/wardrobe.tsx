import { fabricFamilies, fabricOptions, garmentGroups, space, wardrobeItems } from '@naqa/shared';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { MultiSelect, type SelectGroup } from '../components/select';
import { BackHeader, BottomBack, Button, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';
import { goBack } from '../lib/nav';
import { format } from '@naqa/shared';

/** Edit the clothing types the user usually washes. */
export default function Wardrobe() {
  const { t, locale, wardrobe, wardrobeOther, fabrics, fabricsOther, saveProfile } = useApp();
  const [fabIds, setFabIds] = useState(fabrics);
  const [fabOther, setFabOther] = useState(fabricsOther);
  const [ids, setIds] = useState(wardrobe);
  const [other, setOther] = useState(wardrobeOther);
  const groups = useMemo<SelectGroup[]>(() => garmentGroups.map((g) => ({ title: g.name[locale], items: wardrobeItems.filter((w) => w.group === g.id).map((w) => ({ id: w.id, label: w.name[locale] })) })), [locale]);
  const fabricGroups = useMemo<SelectGroup[]>(() => fabricFamilies.map((fam) => ({ title: fam.name[locale], items: fabricOptions.filter((f) => f.family === fam.id).map((f) => ({ id: f.id, label: f.name[locale] })) })), [locale]);
  return (
    <Screen>
      <BackHeader title={t.appliances.wardrobeTitle} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.lg }} keyboardShouldPersistTaps="handled">
        <Text muted>{t.profile.clothesIntro}</Text>
        <MultiSelect placeholder={t.profile.pickClothes} groups={groups} values={ids} onChange={setIds} searchPlaceholder={t.manual.searchGarment}
          summary={format(t.profile.selected, { n: ids.length })} doneLabel={t.profile.done}
          otherPlaceholder={t.profile.otherClothes} otherValue={other} onOtherChange={setOther} />
        <Text muted>{t.profile.fabricsIntro}</Text>
        <MultiSelect placeholder={t.profile.pickFabrics} groups={fabricGroups} values={fabIds} onChange={setFabIds} searchPlaceholder={t.profile.searchFabric}
          summary={format(t.profile.selected, { n: fabIds.length })} doneLabel={t.profile.done}
          otherPlaceholder={t.profile.otherFabrics} otherValue={fabOther} onOtherChange={setFabOther} />
      </ScrollView>
      <View style={{ gap: space.sm, paddingBottom: space.lg }}>
        <Button label={t.appliances.save} onPress={() => { saveProfile({ wardrobe: ids, wardrobeOther: other.trim(), fabrics: fabIds, fabricsOther: fabOther.trim() }); goBack(); }} />
        <BottomBack onPress={goBack} />
      </View>
    </Screen>
  );
}
