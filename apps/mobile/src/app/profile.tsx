import { countries, fabricFamilies, fabricOptions, format, garmentGroups, space, wardrobeItems } from '@naqa/shared';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ApplianceCard, toDraft, toProfile } from '../components/appliance-card';
import { CareProductsPicker, type CareProductsValue } from '../components/care-products-picker';
import { MultiSelect, Select, type SelectGroup } from '../components/select';
import { Button, Card, FadeIn, IconBubble, Row, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';

/** Shown once after creating an account. Everything is optional; "Later" skips it. */
export default function Profile() {
  const { t, locale, place, washer, dryer, wardrobe, wardrobeOther, fabrics, fabricsOther, detergents, detergentsOther, softeners, softenersOther, saveProfile } = useApp();
  const country = countries[0];
  const [cityId, setCityId] = useState<string | undefined>(place?.cityId);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>(place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : undefined);
  const [denied, setDenied] = useState(false);
  const [w, setW] = useState(() => toDraft(washer));
  const [d, setD] = useState(() => toDraft(dryer));
  const [ids, setIds] = useState(wardrobe);
  const [other, setOther] = useState(wardrobeOther);
  const [fabIds, setFabIds] = useState(fabrics);
  const [fabOther, setFabOther] = useState(fabricsOther);
  const [care, setCare] = useState<CareProductsValue>({ detergents, detergentsOther, softeners, softenersOther });

  const cities = useMemo<SelectGroup[]>(() => [{ items: country.cities.map((c) => ({ id: c.id, label: c.name[locale] })) }], [country, locale]);
  const clothes = useMemo<SelectGroup[]>(() => garmentGroups.map((g) => ({ title: g.name[locale], items: wardrobeItems.filter((x) => x.group === g.id).map((x) => ({ id: x.id, label: x.name[locale] })) })), [locale]);

  const fabricGroups = useMemo<SelectGroup[]>(() => fabricFamilies.map((fam) => ({ title: fam.name[locale], items: fabricOptions.filter((f) => f.family === fam.id).map((f) => ({ id: f.id, label: f.name[locale] })) })), [locale]);

  async function useMyLocation() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) { setDenied(true); return; }
    setDenied(false);
    const pos = (await Location.getLastKnownPositionAsync()) ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  }

  function save() {
    saveProfile({
      place: cityId ? { countryCode: country.code, cityId, ...coords } : undefined,
      washer: toProfile(w), dryer: toProfile(d), wardrobe: ids, wardrobeOther: other.trim(), fabrics: fabIds, fabricsOther: fabOther.trim(),
      detergents: care.detergents, detergentsOther: care.detergentsOther.trim(), softeners: care.softeners, softenersOther: care.softenersOther.trim(), done: true,
    });
    router.replace('/');
  }
  function later() { saveProfile({ done: true }); router.replace('/'); }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: space.xl, gap: space.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.sm }}>
          <Text variant="heading" weight="bold">{t.profile.title}</Text>
          <Text muted>{t.profile.intro}</Text>
        </View>

        <FadeIn>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="map-pin" tone="accent" /><Text weight="semibold">{t.profile.location}</Text></Row>
            <Select placeholder={t.profile.pickCity} groups={cities} value={cityId} onChange={setCityId} />
            <Button variant="quiet" icon="navigation" label={coords ? `${t.place.useLocation} ✓` : t.place.useLocation} onPress={useMyLocation} />
            {denied ? <Text variant="caption" muted>{t.place.locationDenied}</Text> : null}
          </Card>
        </FadeIn>

        <FadeIn delay={60}><ApplianceCard kind="washer" draft={w} onChange={setW} /></FadeIn>
        <FadeIn delay={90}><ApplianceCard kind="dryer" draft={d} onChange={setD} /></FadeIn>

        <FadeIn delay={120}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="user" /><Text weight="semibold">{t.profile.clothes}</Text></Row>
            <Text variant="caption" muted>{t.profile.clothesIntro}</Text>
            <MultiSelect placeholder={t.profile.pickClothes} groups={clothes} values={ids} onChange={setIds} searchPlaceholder={t.manual.searchGarment}
              summary={format(t.profile.selected, { n: ids.length })} doneLabel={t.profile.done}
              otherPlaceholder={t.profile.otherClothes} otherValue={other} onOtherChange={setOther} />
          </Card>
        </FadeIn>

        <FadeIn delay={150}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="layers" tone="accent" /><Text weight="semibold">{t.profile.fabrics}</Text></Row>
            <Text variant="caption" muted>{t.profile.fabricsIntro}</Text>
            <MultiSelect placeholder={t.profile.pickFabrics} groups={fabricGroups} values={fabIds} onChange={setFabIds} searchPlaceholder={t.profile.searchFabric}
              summary={format(t.profile.selected, { n: fabIds.length })} doneLabel={t.profile.done}
              otherPlaceholder={t.profile.otherFabrics} otherValue={fabOther} onOtherChange={setFabOther} />
          </Card>
        </FadeIn>
        <FadeIn delay={180}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="droplet" tone="success" /><Text weight="semibold">{t.profile.products}</Text></Row>
            <Text variant="caption" muted>{t.profile.productsIntro}</Text>
            <CareProductsPicker value={care} onChange={setCare} />
          </Card>
        </FadeIn>
        <Text variant="caption" muted>{t.appliances.editHint}</Text>
      </ScrollView>
      <View style={{ gap: space.sm, paddingBottom: space.lg }}>
        <Button label={t.profile.saveContinue} onPress={save} />
        <Button variant="quiet" label={t.profile.later} onPress={later} />
      </View>
    </Screen>
  );
}
