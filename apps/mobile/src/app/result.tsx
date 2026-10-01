import { Feather } from '@expo/vector-icons';
import {
  countries, format, radius, recommendProducts, space,
  type FabricType, type GarmentAnalysis,
} from '@naqa/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, Row, Screen, Text } from '../components/ui';
import { withFabric } from '../lib/analyze';
import { useApp } from '../lib/app-context';

const fabrics: FabricType[] = ['cotton', 'linen', 'wool', 'silk', 'polyester', 'nylon', 'denim', 'cashmere', 'viscose', 'synthetic_blend'];

function Setting({ label, value, allowed }: { label: string; value: string; allowed?: boolean }) {
  const { colors } = useApp();
  return (
    <Row style={{ justifyContent: 'space-between', minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <Text muted>{label}</Text>
      <Row gap={6}>
        {allowed != null ? (
          <Feather name={allowed ? 'check' : 'x'} size={16} color={allowed ? colors.successText : colors.danger} />
        ) : null}
        <Text weight="semibold">{value}</Text>
      </Row>
    </Row>
  );
}

export default function Result() {
  const { t, locale, colors, place } = useApp();
  const params = useLocalSearchParams<{ analysis: string }>();
  const initial = useMemo<GarmentAnalysis>(() => JSON.parse(params.analysis), [params.analysis]);
  const [analysis, setAnalysis] = useState(initial);
  const r = analysis.recommendation;
  const known = analysis.fabric !== 'unknown';

  const city = countries.find((c) => c.code === place?.countryCode)?.cities.find((c) => c.id === place?.cityId);
  const origin = place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : city;
  const picks = useMemo(
    () => (place ? recommendProducts(analysis.fabric, place.cityId, origin) : []),
    [analysis.fabric, place, origin?.lat, origin?.lng],
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }}>
        <View style={{ gap: space.sm }}>
          <Text variant="caption" muted>{t.result.title}</Text>
          <Text variant="heading" weight="bold">
            {format(t.result.summary, { program: t.programs[r.program], temp: r.temperature })}
          </Text>
          {analysis.confidence > 0 && analysis.confidence < 1 ? (
            <Text variant="caption" muted>{format(t.result.confidence, { pct: Math.round(analysis.confidence * 100) })}</Text>
          ) : null}
        </View>

        {analysis.confidence < 0.7 ? (
          <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.lg, gap: space.md }}>
            <Text>{t.result.lowConfidence}</Text>
            <Text weight="semibold">{t.result.pickFabric}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
              {fabrics.map((f) => (
                <Chip key={f} label={t.fabrics[f]} selected={analysis.fabric === f} onPress={() => setAnalysis(withFabric(analysis, f))} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View>
          <Setting label={t.result.fabric} value={t.fabrics[analysis.fabric]} />
          <Setting label={t.result.program} value={t.programs[r.program]} />
          <Setting label={t.result.temperature} value={`${r.temperature}°C`} />
          <Setting label={t.result.spin} value={t.levels[r.spin]} />
          <Setting label={t.result.tumbleDry} value={r.tumbleDry ? t.result.yes : t.result.no} allowed={r.tumbleDry} />
          <Setting label={t.result.iron} value={t.levels[r.iron]} />
          <Setting label={t.result.bleach} value={r.bleachAllowed ? t.result.yes : t.result.no} allowed={r.bleachAllowed} />
        </View>

        {r.notes.length > 0 ? (
          <View style={{ gap: space.sm }}>
            <Text weight="semibold">{t.result.notes}</Text>
            {r.notes.map((n, i) => <Text key={i} muted>{`• ${n}`}</Text>)}
          </View>
        ) : null}

        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.result.buy}</Text>
          {!known ? <Text muted>{t.result.buyEmpty}</Text> : null}
          {picks.map(({ product, store, km }) => (
            <View key={product.id} style={{ gap: 2, paddingBottom: space.md, borderBottomWidth: 1, borderBottomColor: colors.line }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text weight="medium" style={{ flex: 1 }}>{product.name[locale]}</Text>
                {product.isSponsored ? <Text variant="caption" weight="medium" color={colors.accentText}>{t.common.sponsored}</Text> : null}
              </Row>
              {store ? (
                <Text variant="caption" muted>
                  {`${store.name[locale]}${km != null ? ` · ${format(t.stores.away, { km: km.toFixed(1) })}` : ''}`}
                </Text>
              ) : (
                <Text variant="caption" muted>{t.result.noStore}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingBottom: space.lg }}>
        <Button variant="quiet" label={t.result.back} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
