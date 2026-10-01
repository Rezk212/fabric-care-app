import { radius, space } from '@naqa/shared';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Chip, Row, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';

function Swatches() {
  const { colors } = useApp();
  const tiles = [
    { bg: colors.primary, rot: '-8deg', w: 150, h: 190 },
    { bg: colors.accent, rot: '4deg', w: 130, h: 170 },
    { bg: colors.surfaceMuted, rot: '-2deg', w: 110, h: 150 },
  ];
  return (
    <View style={{ height: 240, justifyContent: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Row gap={0} style={{ justifyContent: 'center' }}>
        {tiles.map((tile, i) => (
          <View
            key={i}
            style={{
              width: tile.w, height: tile.h, borderRadius: radius.lg,
              backgroundColor: tile.bg, marginHorizontal: -14, transform: [{ rotate: tile.rot }],
              shadowColor: '#14233A', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 10 },
              elevation: 6,
            }}
          />
        ))}
      </Row>
    </View>
  );
}

export default function Welcome() {
  const { t, locale, setLocale, finishOnboarding } = useApp();
  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', paddingTop: space.lg }}>
        <Text variant="title" weight="bold">{t.appName}</Text>
        <Row gap={space.sm}>
          <Chip label="العربية" selected={locale === 'ar'} onPress={() => setLocale('ar')} />
          <Chip label="English" selected={locale === 'en'} onPress={() => setLocale('en')} />
        </Row>
      </Row>
      <View style={{ flex: 1, justifyContent: 'center', gap: space.xl }}>
        <Swatches />
        <View style={{ gap: space.md }}>
          <Text variant="display" weight="bold">{t.welcome.title}</Text>
          <Text muted>{t.welcome.body}</Text>
        </View>
      </View>
      <View style={{ paddingBottom: space.xl }}>
        <Button
          label={t.welcome.start}
          onPress={() => { finishOnboarding(); router.replace('/place'); }}
        />
      </View>
    </Screen>
  );
}
