import { Feather } from '@expo/vector-icons';
import { CHECK_LABEL_NOTE, gulfGarments, space } from '@naqa/shared';
import { router } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';
import { BackHeader, BottomBack, Card, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { goBack } from '../../lib/nav';
import { useApp } from '../../lib/app-context';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export default function Garments() {
  const { t, locale, colors, rtl } = useApp();
  return (
    <Screen>
      <BackHeader title={t.guide.garments} onBack={goBack} tour="garments" />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.md }} showsVerticalScrollIndicator={false}>
        <Text variant="caption" muted>{CHECK_LABEL_NOTE[locale]}</Text>
        {gulfGarments.map((g, i) => (
          <FadeIn key={g.id} delay={i * 50}>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/guide/garment/[id]', params: { id: g.id } })}>
              <Card>
                <Row>
                  <IconBubble name={g.icon as FeatherName} />
                  <Text weight="semibold" style={{ flex: 1 }}>{g.name[locale]}</Text>
                  <Feather name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.inkMuted} />
                </Row>
              </Card>
            </Pressable>
          </FadeIn>
        ))}
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
