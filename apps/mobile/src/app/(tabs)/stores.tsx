import { Feather } from '@expo/vector-icons';
import { countries, format, omanChains, space, type LatLng } from '@naqa/shared';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, ScrollView, View } from 'react-native';
import { Button, Card, Chip, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { fetchBranches, type Branch } from '../../lib/osm';

type Origin = { kind: 'gps'; at: LatLng } | { kind: 'city'; cityId: string };

export default function Stores() {
  const { t, locale, place, colors } = useApp();
  const cities = countries.find((c) => c.code === (place?.countryCode ?? 'OM'))?.cities ?? countries[0].cities;
  const [origin, setOrigin] = useState<Origin>(() =>
    place?.lat != null && place?.lng != null ? { kind: 'gps', at: { lat: place.lat, lng: place.lng } } : { kind: 'city', cityId: place?.cityId ?? cities[0].id });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [denied, setDenied] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  const point: LatLng = useMemo(() => {
    if (origin.kind === 'gps') return origin.at;
    const c = cities.find((x) => x.id === origin.cityId) ?? cities[0];
    return { lat: c.lat, lng: c.lng };
  }, [origin, cities]);

  useEffect(() => {
    let live = true;
    setLoading(true); setFailed(false);
    fetchBranches(point)
      .then((b) => { if (live) setBranches(b); })
      .catch((e) => { if (live) { setBranches([]); setFailed(true); setErrorText(e instanceof Error ? e.message : String(e)); } })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [point.lat, point.lng]);

  async function locate() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) { setDenied(true); return; }
    setDenied(false);
    // A cached fix is instant; otherwise ask for a fresh, coarse one but never wait forever.
    let pos = await Location.getLastKnownPositionAsync();
    if (!pos) {
      pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<null>((r) => setTimeout(() => r(null), 12_000)),
      ]);
    }
    if (!pos) { setDenied(true); return; }
    setOrigin({ kind: 'gps', at: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
  }

  const present = omanChains.filter((c) => branches.some((b) => b.chain.id === c.id));
  const data = chainId ? branches.filter((b) => b.chain.id === chainId) : branches;

  return (
    <Screen floatingTabs>
      <FlatList
        data={data}
        keyExtractor={(b) => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.md, marginBottom: space.md }}>
            <Text variant="heading" weight="bold">{t.stores.title}</Text>
            <Button variant={origin.kind === 'gps' ? 'quiet' : 'primary'} icon="navigation"
              label={origin.kind === 'gps' ? `${t.stores.myLocation} ✓` : t.stores.locate} onPress={locate} />
            {denied ? <Text variant="caption" muted>{t.stores.locationDenied}</Text> : null}
            <Text variant="caption" muted>{t.stores.area}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
              {cities.map((c) => (
                <Chip key={c.id} label={c.name[locale]} selected={origin.kind === 'city' && origin.cityId === c.id}
                  onPress={() => setOrigin({ kind: 'city', cityId: c.id })} />
              ))}
            </ScrollView>
            {present.length > 1 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                <Chip label={t.stores.all} selected={chainId === null} onPress={() => setChainId(null)} />
                {present.map((c) => <Chip key={c.id} label={c.name[locale]} selected={chainId === c.id} onPress={() => setChainId(c.id)} />)}
              </ScrollView>
            ) : null}
            {loading ? <Row gap={space.sm}><ActivityIndicator color={colors.primary} /><Text muted>{t.stores.searching}</Text></Row> : null}
            {failed ? <Text variant="caption" muted>{t.stores.offline}{errorText ? `\n${errorText}` : ''}</Text> : null}
          </View>
        }
        ListEmptyComponent={loading ? null : <Text muted>{failed ? t.stores.empty : t.stores.none}</Text>}
        ListFooterComponent={!failed && data.length ? <Text variant="caption" muted style={{ marginTop: space.md }}>{t.stores.live}</Text> : null}
        renderItem={({ item, index }) => (
          <FadeIn delay={Math.min(index, 8) * 40}>
            <Card style={{ gap: space.md }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <IconBubble name="shopping-bag" tone="primary" />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text weight="semibold">{item.chain.name[locale]}</Text>
                  {item.name !== item.chain.name.en && /[A-Za-z]/.test(item.name) && locale === 'en' ? <Text variant="caption" muted>{item.name}</Text> : null}
                  {item.address ? <Text variant="caption" muted>{item.address}</Text> : null}
                  <Row gap={6}>
                    <Feather name="navigation" size={13} color={colors.inkMuted} />
                    <Text variant="caption" muted>{format(t.stores.away, { km: item.km.toFixed(1) })}</Text>
                  </Row>
                </View>
              </Row>
              <Button variant="quiet" icon="map-pin" label={t.stores.directions}
                onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`)} />
            </Card>
          </FadeIn>
        )}
      />
    </Screen>
  );
}
