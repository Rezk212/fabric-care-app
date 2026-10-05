import { Feather } from '@expo/vector-icons';
import { countries, format, omanChains, products, space } from '@naqa/shared';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Button, Card, Pill, ProductThumb, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { goBack } from '../../lib/nav';
import { fetchBranches, type Branch } from '../../lib/osm';

/** One product: what it is, how to use it, where to find it nearby and its price when a store has supplied one. */
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale, place, colors } = useApp();
  const product = products.find((p) => p.id === id);
  const city = countries.find((c) => c.code === place?.countryCode)?.cities.find((c) => c.id === place?.cityId);
  const origin = place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : city;
  const [branches, setBranches] = useState<Branch[]>([]);
  useEffect(() => {
    if (!origin) return;
    let live = true;
    fetchBranches(origin).then((b) => { if (live) setBranches(b); }).catch(() => {});
    return () => { live = false; };
  }, [origin?.lat, origin?.lng]);

  if (!product) {
    return (
      <Screen>
        <BackHeader title={t.product.title} onBack={goBack} />
        <View style={{ flex: 1 }} />
        <BottomBack onPress={goBack} />
      </Screen>
    );
  }

  const near = branches.filter((b) => product.chainIds?.includes(b.chain.id)).slice(0, 5);
  const chains = omanChains.filter((c) => product.chainIds?.includes(c.id)).map((c) => c.name[locale]).join(' · ');

  return (
    <Screen>
      <BackHeader title={t.product.title} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.lg }} showsVerticalScrollIndicator={false}>
        <Row style={{ alignItems: 'flex-start' }} gap={space.lg}>
          <ProductThumb imageUrl={product.imageUrl} kind={product.kind} size={96} />
          <View style={{ flex: 1, gap: space.sm }}>
            <Text variant="title" weight="bold">{product.name[locale]}</Text>
            <Row style={{ flexWrap: 'wrap' }} gap={space.sm}>
              <Pill tone="primary" label={t.product.kinds[product.kind]} />
              {product.isSponsored ? <Pill tone="accent" label={t.common.sponsored} /> : null}
              {product.isSample ? <Pill tone="muted" label={t.stores.sample} /> : null}
            </Row>
            {product.brand ? <Text muted>{product.brand}</Text> : null}
          </View>
        </Row>

        {product.description ? (
          <Card style={{ gap: space.sm }}>
            <Text weight="semibold">{t.product.about}</Text>
            <Text muted>{product.description[locale]}</Text>
            {product.isSample ? <Text variant="caption" muted>{t.product.sampleNote}</Text> : null}
          </Card>
        ) : null}

        <Card style={{ gap: space.sm }}>
          <Text weight="semibold">{t.product.suitableFor}</Text>
          <Row style={{ flexWrap: 'wrap' }} gap={space.sm}>
            {product.forFabrics.map((f) => <Pill key={f} tone="surface" label={t.fabrics[f]} />)}
          </Row>
        </Card>

        {product.usage && product.usage.length > 0 ? (
          <Card style={{ gap: space.sm }}>
            <Text weight="semibold">{t.product.howToUse}</Text>
            {product.usage.map((u, i) => <Text key={i} muted>{`${i + 1}. ${u[locale]}`}</Text>)}
            {product.caution ? (
              <Row gap={space.sm} style={{ alignItems: 'flex-start', marginTop: space.xs }}>
                <Feather name="alert-triangle" size={16} color={colors.accentText} style={{ marginTop: 3 }} />
                <Text style={{ flex: 1 }} color={colors.accentText}>{`${t.product.caution}: ${product.caution[locale]}`}</Text>
              </Row>
            ) : null}
          </Card>
        ) : null}

        <Card style={{ gap: space.sm }}>
          <Text weight="semibold">{t.product.price}</Text>
          {product.priceOMR != null
            ? <Text variant="title" weight="bold">{`${product.priceOMR.toFixed(3)} ${t.product.priceUnit}`}</Text>
            : <Text muted>{t.product.noPrice}</Text>}
          <Text variant="caption" muted>{t.result.confirmStock}</Text>
        </Card>

        <View style={{ gap: space.md }}>
          <Text variant="title" weight="semibold">{t.product.whereToFind}</Text>
          {chains ? <Text variant="caption" muted>{`${t.result.usuallyAt}: ${chains}`}</Text> : null}
          {near.length === 0 ? <Text muted>{t.product.noBranches}</Text> : null}
          {near.map((b) => (
            <Card key={b.id} style={{ gap: space.sm }}>
              <Text weight="semibold">{b.chain.name[locale]}</Text>
              {b.address ? <Text variant="caption" muted>{b.address}</Text> : null}
              <Row gap={6}>
                <Feather name="navigation" size={13} color={colors.inkMuted} />
                <Text variant="caption" muted>{format(t.stores.away, { km: b.km.toFixed(1) })}</Text>
              </Row>
              <Button variant="quiet" icon="map-pin" label={t.stores.directions} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`)} />
            </Card>
          ))}
        </View>
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
