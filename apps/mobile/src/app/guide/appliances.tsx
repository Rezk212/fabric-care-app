import { applianceTypes, capacityGuide, space } from '@naqa/shared';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Card, Chip, FadeIn, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { goBack } from '../../lib/nav';

export default function Appliances() {
  const { t, locale } = useApp();
  const [kind, setKind] = useState<'washer' | 'dryer'>('washer');
  const items = applianceTypes.filter((a) => a.kind === kind);
  return (
    <Screen>
      <BackHeader title={t.guide.appliances} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.md }} showsVerticalScrollIndicator={false}>
        <Row style={{ flexWrap: 'wrap' }}>
          <Chip label={t.guide.washers} selected={kind === 'washer'} onPress={() => setKind('washer')} />
          <Chip label={t.guide.dryers} selected={kind === 'dryer'} onPress={() => setKind('dryer')} />
        </Row>
        {items.map((a, i) => (
          <FadeIn key={a.id} delay={i * 50}>
            <Card style={{ gap: space.md }}>
              <Text weight="semibold">{a.name[locale]}</Text>
              <Text muted>{a.how[locale]}</Text>
              <View style={{ gap: 4 }}>
                <Text variant="caption" weight="semibold">{t.guide.pros}</Text>
                {a.pros.map((p, j) => <Text key={j} variant="caption" muted>{`• ${p[locale]}`}</Text>)}
              </View>
              <View style={{ gap: 4 }}>
                <Text variant="caption" weight="semibold">{t.guide.cons}</Text>
                {a.cons.map((p, j) => <Text key={j} variant="caption" muted>{`• ${p[locale]}`}</Text>)}
              </View>
              <Text variant="caption"><Text variant="caption" weight="semibold">{`${t.guide.bestFor}: `}</Text>{a.bestFor[locale]}</Text>
            </Card>
          </FadeIn>
        ))}
        <Card style={{ gap: space.sm }}>
          <Text weight="semibold">{t.guide.capacity}</Text>
          <Text variant="caption" muted>{capacityGuide[locale]}</Text>
        </Card>
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
