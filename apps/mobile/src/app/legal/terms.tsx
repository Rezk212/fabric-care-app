import { termsOfUse, space } from '@naqa/shared';
import { ScrollView, View } from 'react-native';
import { BackHeader, BottomBack, Card, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { goBack } from '../../lib/nav';

export default function Legal() {
  const { t, locale } = useApp();
  return (
    <Screen>
      <BackHeader title={t.settings.terms} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.md }} showsVerticalScrollIndicator={false}>
        <Text variant="caption" muted>{t.settings.draftNote}</Text>
        {termsOfUse.map((s, i) => (
          <Card key={i} style={{ gap: space.sm }}>
            <Text weight="semibold">{s.title[locale]}</Text>
            <Text muted>{s.body[locale]}</Text>
          </Card>
        ))}
        <View style={{ height: space.sm }} />
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
