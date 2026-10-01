import { Feather } from '@expo/vector-icons';
import { CHECK_LABEL_NOTE, radius, space, stainAdvice, stainGuides, type FabricType } from '@naqa/shared';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Card, Chip, FadeIn, IconBubble, Row, Screen, Text, useShadow } from '../../components/ui';
import { goBack } from '../../lib/nav';
import { useApp } from '../../lib/app-context';

const fabrics: FabricType[] = ['cotton', 'linen', 'denim', 'polyester', 'nylon', 'synthetic_blend', 'silk', 'wool', 'cashmere', 'viscose', 'unknown'];
type FeatherName = React.ComponentProps<typeof Feather>['name'];

export default function Stains() {
  const { t, locale, colors } = useApp();
  const shadow = useShadow(0.5);
  const [stainId, setStainId] = useState(stainGuides[0].id);
  const [fabric, setFabric] = useState<FabricType>('cotton');
  const advice = stainAdvice(stainId, fabric)!;

  return (
    <Screen>
      <BackHeader title={t.guide.stains} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.xl }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.guide.pickStain}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.md }}>
            {stainGuides.map((s) => {
              const on = s.id === stainId;
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => setStainId(s.id)}
                  style={[{ width: '48.5%', minHeight: 64, borderRadius: radius.lg, padding: space.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: on ? colors.primary : 'transparent', justifyContent: 'center' }, shadow]}
                >
                  <Row gap={space.sm}>
                    <IconBubble name={s.icon as FeatherName} size={34} tone={on ? 'primary' : 'accent'} />
                    <Text variant="caption" weight="semibold" style={{ flex: 1 }}>{s.name[locale]}</Text>
                  </Row>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.guide.pickFabric}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {fabrics.map((f) => <Chip key={f} label={t.fabrics[f]} selected={f === fabric} onPress={() => setFabric(f)} />)}
          </ScrollView>
        </View>

        <FadeIn key={`${stainId}-${advice.delicate}`}>
          <Card style={{ gap: space.md }}>
            {advice.delicate ? (
              <Row gap={space.sm} style={{ alignItems: 'flex-start' }}>
                <Feather name="alert-circle" size={18} color={colors.accentText} style={{ marginTop: 3 }} />
                <Text variant="caption" style={{ flex: 1 }}>{t.guide.delicateWarn}</Text>
              </Row>
            ) : null}
            <Text variant="title" weight="semibold">{t.guide.steps}</Text>
            {advice.steps.map((step, i) => (
              <Row key={i} style={{ alignItems: 'flex-start' }} gap={space.sm}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <Text variant="caption" weight="bold" color={colors.primary}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1 }}>{step[locale]}</Text>
              </Row>
            ))}
            <Text weight="semibold" color={colors.danger}>{t.guide.avoid}</Text>
            {advice.avoid.map((a, i) => <Text key={i}>{`• ${a[locale]}`}</Text>)}
          </Card>
        </FadeIn>

        <Text variant="caption" muted>{`${t.guide.testFirst} ${CHECK_LABEL_NOTE[locale]}`}</Text>
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
