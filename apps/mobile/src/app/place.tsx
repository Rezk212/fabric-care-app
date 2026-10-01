import { Feather } from '@expo/vector-icons';
import { countries, radius, space } from '@naqa/shared';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Chip, FadeIn, IconBubble, Row, Screen, Text, useShadow } from '../components/ui';
import { useApp } from '../lib/app-context';

export default function PlaceScreen() {
  const { t, locale, place, setPlace, colors } = useApp();
  const shadow = useShadow(0.5);
  const [countryCode, setCountryCode] = useState(place?.countryCode ?? countries[0].code);
  const [cityId, setCityId] = useState<string | undefined>(place?.cityId);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>(
    place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : undefined,
  );
  const [denied, setDenied] = useState(false);

  const country = countries.find((c) => c.code === countryCode) ?? countries[0];

  async function useMyLocation() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) { setDenied(true); return; }
    setDenied(false);
    const pos = await Location.getCurrentPositionAsync({});
    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  }

  function save() {
    if (!cityId) return;
    setPlace({ countryCode, cityId, ...coords });
    router.replace('/');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }} showsVerticalScrollIndicator={false}>
        <FadeIn style={{ gap: space.sm }}>
          <Text variant="heading" weight="bold">{t.place.title}</Text>
        </FadeIn>

        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.place.country}</Text>
          <Row style={{ flexWrap: 'wrap' }}>
            {countries.map((c) => (
              <Chip key={c.code} label={c.name[locale]} selected={c.code === countryCode}
                onPress={() => { setCountryCode(c.code); setCityId(undefined); }} />
            ))}
          </Row>
        </View>

        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.place.city}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.md }}>
            {country.cities.map((c, i) => {
              const selected = c.id === cityId;
              return (
                <FadeIn key={c.id} delay={60 * i} style={{ width: '48.5%' }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCityId(c.id)}
                    style={({ pressed }) => [{
                      minHeight: 76, borderRadius: radius.lg, padding: space.lg, justifyContent: 'center', gap: 6,
                      backgroundColor: colors.surface, borderWidth: 2, borderColor: selected ? colors.primary : 'transparent',
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    }, shadow]}
                  >
                    <Row style={{ justifyContent: 'space-between' }}>
                      <IconBubble name="map-pin" size={36} tone={selected ? 'primary' : 'accent'} />
                      {selected ? <Feather name="check-circle" size={20} color={colors.primary} /> : null}
                    </Row>
                    <Text weight="semibold">{c.name[locale]}</Text>
                  </Pressable>
                </FadeIn>
              );
            })}
          </View>
        </View>

        <View style={{ gap: space.sm }}>
          <Button variant="quiet" icon="navigation" label={coords ? `${t.place.useLocation} ✓` : t.place.useLocation} onPress={useMyLocation} />
          {denied ? <Text variant="caption" muted>{t.place.locationDenied}</Text> : null}
        </View>
      </ScrollView>
      <View style={{ paddingBottom: space.xl }}>
        <Button label={t.place.continue} onPress={save} disabled={!cityId} />
      </View>
    </Screen>
  );
}
