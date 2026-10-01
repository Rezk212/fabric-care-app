import { Feather } from '@expo/vector-icons';
import { CHECK_LABEL_NOTE, baselineRecommendation, gulfGarments, space } from '@naqa/shared';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Button, Card, Pill, Row, Screen, Text } from '../../../components/ui';
import { goBack } from '../../../lib/nav';
import { useApp } from '../../../lib/app-context';

export default function GarmentDetail() {
  const { t, locale, colors } = useApp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = gulfGarments.find((x) => x.id === id);
  if (!g) return null;

  function openPlan() {
    // Confidence 0: this is a typical fabric for the garment, not a reading of the user's photo.
    const analysis = {
      fabric: g!.fabric,
      confidence: 0,
      careSymbolsDetected: [],
      recommendation: { ...baselineRecommendation(g!.fabric), notes: g!.tips.slice(0, 2).map((x) => x[locale]) },
    };
    router.push({ pathname: '/result', params: { analysis: JSON.stringify(analysis) } });
  }

  return (
    <Screen>
      <BackHeader title={g.name[locale]} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.xl }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: space.sm }}>
          <Pill tone="primary" icon="layers" label={`${t.guide.usualFabric}: ${t.fabrics[g.fabric]}`} />
          <Text variant="caption" muted>{g.fabricNote[locale]}</Text>
        </Card>

        <View style={{ gap: space.md }}>
          <Text variant="title" weight="semibold">{t.guide.tips}</Text>
          {g.tips.map((tip, i) => (
            <Row key={i} style={{ alignItems: 'flex-start' }} gap={space.sm}>
              <Feather name="check-circle" size={18} color={colors.successText} style={{ marginTop: 3 }} />
              <Text style={{ flex: 1 }}>{tip[locale]}</Text>
            </Row>
          ))}
        </View>

        <View style={{ gap: space.md }}>
          <Text variant="title" weight="semibold">{t.guide.avoid}</Text>
          {g.avoid.map((a, i) => (
            <Row key={i} style={{ alignItems: 'flex-start' }} gap={space.sm}>
              <Feather name="x-circle" size={18} color={colors.danger} style={{ marginTop: 3 }} />
              <Text style={{ flex: 1 }}>{a[locale]}</Text>
            </Row>
          ))}
        </View>

        <Text variant="caption" muted>{CHECK_LABEL_NOTE[locale]}</Text>
        <Button icon="droplet" label={t.guide.openPlan} onPress={openPlan} />
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
