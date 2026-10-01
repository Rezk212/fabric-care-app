import { Feather } from '@expo/vector-icons';
import {
  countries, explainSymbols, format, matchMachineProgram, radius, recommendProducts, space,
  type FabricType, type GarmentAnalysis,
} from '@naqa/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';
import { BottomBack, Card, Chip, FadeIn, IconBubble, Pill, Row, Screen, SymbolGlyph, Text } from '../components/ui';
import { withFabric } from '../lib/analyze';
import { useApp } from '../lib/app-context';
import { listMachines } from '../lib/data';
import { goBack } from '../lib/nav';

const fabrics: FabricType[] = ['cotton', 'linen', 'wool', 'silk', 'polyester', 'nylon', 'denim', 'cashmere', 'viscose', 'synthetic_blend'];
type FeatherName = React.ComponentProps<typeof Feather>['name'];

function Setting({ icon, label, value, allowed, last }: { icon: FeatherName; label: string; value: string; allowed?: boolean; last?: boolean }) {
  const { colors } = useApp();
  return (
    <Row style={{ minHeight: 60, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <IconBubble name={icon} size={36} tone={allowed === false ? 'accent' : allowed === true ? 'success' : 'primary'} />
      <Text muted style={{ flex: 1 }}>{label}</Text>
      <Row gap={6}>
        {allowed != null ? <Feather name={allowed ? 'check' : 'x'} size={16} color={allowed ? colors.successText : colors.danger} /> : null}
        <Text weight="semibold">{value}</Text>
      </Row>
    </Row>
  );
}

export default function Result() {
  const { t, locale, colors, place, rtl } = useApp();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ analysis: string; machinePrograms?: string }>();
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
  const pct = Math.round(analysis.confidence * 100);

  // Programme names on the user's own machine: from this analysis, else from a saved machine.
  const [machineLabels, setMachineLabels] = useState<string[]>(() => {
    try { return JSON.parse(params.machinePrograms ?? '[]') as string[]; } catch { return []; }
  });
  useEffect(() => {
    if (machineLabels.length > 0) return;
    void listMachines().then((ms) => {
      const m = ms.find((x) => x.programs && x.programs.length > 0);
      if (m?.programs) setMachineLabels(m.programs);
    });
  }, [machineLabels.length]);
  const machineLabel = matchMachineProgram(r.program, machineLabels);
  const symbols = useMemo(() => explainSymbols(analysis.careSymbolsDetected), [analysis.careSymbolsDetected]);

  return (
    <Screen padded={false} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingBottom: space.xl }} showsVerticalScrollIndicator={false}>
        <FadeIn>
          <LinearGradient colors={[colors.heroFrom, colors.heroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: space.xl, paddingTop: insets.top + space.xl, paddingBottom: space.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, gap: space.lg }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="caption" weight="medium" color={colors.onHeroMuted}>{t.result.title}</Text>
              <Pill tone="hero" icon="layers" label={t.fabrics[analysis.fabric]} />
            </Row>
            <Text variant="display" weight="bold" color={colors.onHero}>
              {format(t.result.summary, { program: t.programs[r.program], temp: r.temperature })}
            </Text>
            {analysis.confidence > 0 && analysis.confidence < 1 ? (
              <View style={{ gap: 8 }}>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
                  <View style={{ width: `${pct}%`, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
                </View>
                <Text variant="caption" color={colors.onHeroMuted}>{format(t.result.confidence, { pct })}</Text>
              </View>
            ) : null}
          </LinearGradient>
        </FadeIn>

        <View style={{ paddingHorizontal: space.xl, gap: space.xl }}>
          {analysis.confidence < 0.7 ? (
            <FadeIn delay={80}>
              <View style={{ backgroundColor: colors.accentSoft, borderRadius: radius.lg, padding: space.lg, gap: space.md }}>
                <Row gap={space.sm}>
                  <Feather name="alert-circle" size={18} color={colors.accentText} />
                  <Text style={{ flex: 1 }} color={colors.ink}>{t.result.lowConfidence}</Text>
                </Row>
                <Text weight="semibold">{t.result.pickFabric}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                  {fabrics.map((f) => (
                    <Chip key={f} label={t.fabrics[f]} selected={analysis.fabric === f} onPress={() => setAnalysis(withFabric(analysis, f))} />
                  ))}
                </ScrollView>
              </View>
            </FadeIn>
          ) : null}

          {machineLabel ? (
            <FadeIn delay={100}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
                <IconBubble name="disc" tone="success" />
                <View style={{ flex: 1 }}>
                  <Text variant="caption" muted>{t.result.onYourMachine}</Text>
                  <Text weight="bold">{machineLabel}</Text>
                </View>
              </Card>
            </FadeIn>
          ) : null}

          <FadeIn delay={120}>
            <Card>
              <Setting icon="thermometer" label={t.result.temperature} value={`${r.temperature}°C`} />
              <Setting icon="sliders" label={t.result.program} value={t.programs[r.program]} />
              <Setting icon="rotate-cw" label={t.result.spin} value={t.levels[r.spin]} />
              <Setting icon="wind" label={t.result.tumbleDry} value={r.tumbleDry ? t.result.yes : t.result.no} allowed={r.tumbleDry} />
              <Setting icon="sun" label={t.result.iron} value={t.levels[r.iron]} />
              <Setting icon="droplet" label={t.result.bleach} value={r.bleachAllowed ? t.result.yes : t.result.no} allowed={r.bleachAllowed} last />
            </Card>
          </FadeIn>

          {symbols.length > 0 ? (
            <View style={{ gap: space.md }}>
              <Text variant="title" weight="semibold">{t.guide.yourLabel}</Text>
              <Card padded={false} style={{ paddingHorizontal: space.lg }}>
                {symbols.map((sy, i) => (
                  <Row key={i} style={{ minHeight: 60, borderBottomWidth: i === symbols.length - 1 ? 0 : 1, borderBottomColor: colors.line }}>
                    <SymbolGlyph kind={sy.kind} level={sy.level} banned={sy.banned} size={38} />
                    <Text style={{ flex: 1 }}>{sy.text[locale]}</Text>
                  </Row>
                ))}
              </Card>
            </View>
          ) : null}

          {r.notes.length > 0 ? (
            <View style={{ gap: space.sm }}>
              <Text weight="semibold">{t.result.notes}</Text>
              {r.notes.map((n, i) => <Text key={i} muted>{`• ${n}`}</Text>)}
            </View>
          ) : null}

          <View style={{ gap: space.md }}>
            <Text variant="title" weight="semibold">{t.result.buy}</Text>
            {!known ? <Text muted>{t.result.buyEmpty}</Text> : null}
            {picks.map(({ product, store, km }, i) => (
              <FadeIn key={product.id} delay={160 + i * 50}>
                <Card style={{ gap: space.sm }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text weight="semibold" style={{ flex: 1 }}>{product.name[locale]}</Text>
                    {product.isSponsored ? <Pill tone="accent" label={t.common.sponsored} /> : null}
                  </Row>
                  <Row gap={6}>
                    <Feather name="map-pin" size={14} color={colors.inkMuted} />
                    <Text variant="caption" muted style={{ flex: 1 }}>
                      {store ? `${store.name[locale]}${km != null ? ` · ${format(t.stores.away, { km: km.toFixed(1) })}` : ''}` : t.result.noStore}
                    </Text>
                  </Row>
                </Card>
              </FadeIn>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: space.xl }}><BottomBack onPress={goBack} /></View>
    </Screen>
  );
}
