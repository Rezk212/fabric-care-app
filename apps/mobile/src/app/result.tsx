import { radius, space, type FabricType, type GarmentAnalysis } from '@naqa/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, Row, Screen, Text } from '../components/ui';
import { withFabric } from '../lib/analyze';
import { useApp } from '../lib/app-context';

const fabrics: FabricType[] = ['cotton', 'linen', 'wool', 'silk', 'polyester', 'nylon', 'denim', 'cashmere', 'viscose', 'synthetic_blend'];

function Fact({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  return (
    <Row style={{ justifyContent: 'space-between', paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <Text muted>{label}</Text>
      <Text weight="semibold">{value}</Text>
    </Row>
  );
}

export default function Result() {
  const { t, locale, colors } = useApp();
  const params = useLocalSearchParams<{ analysis: string }>();
  const initial = useMemo<GarmentAnalysis>(() => JSON.parse(params.analysis), [params.analysis]);
  const [analysis, setAnalysis] = useState(initial);
  const r = analysis.recommendation;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }}>
        <Text variant="heading" weight="bold">{t.result.title}</Text>

        {analysis.confidence < 0.7 ? (
          <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.lg, gap: space.md }}>
            <Text>{t.result.lowConfidence}</Text>
            <Text weight="semibold">{t.result.fabric}</Text>
            <Row style={{ flexWrap: 'wrap' }}>
              {fabrics.map((f) => (
                <Chip key={f} label={t.fabrics[f]} selected={analysis.fabric === f} onPress={() => setAnalysis(withFabric(analysis, f))} />
              ))}
            </Row>
          </View>
        ) : null}

        <View>
          <Fact label={t.result.fabric} value={t.fabrics[analysis.fabric]} />
          <Fact label={t.result.program} value={t.programs[r.program]} />
          <Fact label={t.result.temperature} value={`${r.temperature}°C`} />
          <Fact label={t.result.spin} value={t.levels[r.spin]} />
          <Fact label={t.result.tumbleDry} value={r.tumbleDry ? t.result.yes : t.result.no} />
          <Fact label={t.result.iron} value={t.levels[r.iron]} />
        </View>
      </ScrollView>
      <View style={{ paddingBottom: space.lg }}>
        <Button variant="quiet" label={t.result.back} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
