import { Feather } from '@expo/vector-icons';
import { format, omanChains, products, space } from '@naqa/shared';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Card, FadeIn, IconBubble, Pill, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { goBack } from '../../lib/nav';
import { fetchBranches, type Branch } from '../../lib/osm';
import { countries } from '@naqa/shared';

export default function Products() {
  const { t, locale, place, colors } = useApp();
  const city = countries.find((c) => c.code === place?.countryCode)?.cities.find((c) => c.id === place?.cityId);
  const origin = place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : city;
  const [branches, setBranches] = useState<Branch[]>([]);
  useEffect(() => {
    if (!origin) return;
    let live = true;
    fetchBranches(origin).then((b) => { if (live) setBranches(b); }).catch(() => {});
    return () => { live = false; };
  }, [origin?.lat, origin?.lng]);

  return (
    <Screen>
      <BackHeader title={t.guide.products} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.md }} showsVerticalScrollIndicator={false}>
        {products.map((p, i) => {
          const near = branches.find((b) => p.chainIds?.includes(b.chain.id));
          const chains = omanChains.filter((c) => p.chainIds?.includes(c.id)).map((c) => c.name[locale]).join(' · ');
          return (
            <FadeIn key={p.id} delay={i * 50}>
              <Card style={{ gap: space.sm }}>
                <Row style={{ alignItems: 'flex-start' }}>
                  <IconBubble name="package" tone="primary" />
                  <Text weight="semibold" style={{ flex: 1 }}>{p.name[locale]}</Text>
                  {p.isSponsored ? <Pill tone="accent" label={t.common.sponsored} /> : null}
                </Row>
                {chains ? <Text variant="caption" muted>{`${t.result.usuallyAt}: ${chains}`}</Text> : null}
                {near ? (
                  <Row gap={6}>
                    <Feather name="map-pin" size={14} color={colors.inkMuted} />
                    <Text variant="caption" muted style={{ flex: 1 }}>
                      {`${t.guide.nearest}: ${near.chain.name[locale]} · ${format(t.stores.away, { km: near.km.toFixed(1) })}`}
                    </Text>
                  </Row>
                ) : null}
              </Card>
            </FadeIn>
          );
        })}
        <Text variant="caption" muted>{t.result.confirmStock}</Text>
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
