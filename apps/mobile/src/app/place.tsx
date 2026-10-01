import { countries, space } from '@naqa/shared';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, Row, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';

export default function PlaceScreen() {
  const { t, locale, place, setPlace } = useApp();
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
    router.replace('/(tabs)');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }}>
        <Text variant="heading" weight="bold">{t.place.title}</Text>

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
          <Row style={{ flexWrap: 'wrap' }}>
            {country.cities.map((c) => (
              <Chip key={c.id} label={c.name[locale]} selected={c.id === cityId} onPress={() => setCityId(c.id)} />
            ))}
          </Row>
        </View>

        <View style={{ gap: space.sm }}>
          <Button variant="quiet" label={t.place.useLocation} onPress={useMyLocation} />
          {denied ? <Text variant="caption" muted>{t.place.locationDenied}</Text> : null}
        </View>
      </ScrollView>
      <View style={{ paddingBottom: space.xl }}>
        <Button label={t.place.continue} onPress={save} disabled={!cityId} />
      </View>
    </Screen>
  );
}
