import { space } from '@naqa/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Chip, DrumArt, FadeIn, Logo, Row, Screen, Text } from '../components/ui';
import { useApp } from '../lib/app-context';

export default function Welcome() {
  const { t, locale, setLocale, finishOnboarding, colors, rtl } = useApp();
  return (
    <LinearGradient colors={[colors.heroFrom, colors.heroTo]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={{ flex: 1 }}>
      <Screen background="transparent">
        <Row style={{ justifyContent: 'space-between', paddingTop: space.lg }}>
          <Row gap={space.sm}>
            <Logo size={34} color="#FFFFFF" wave={colors.accent} />
            <Text variant="title" weight="bold" color="#FFFFFF">{t.appName}</Text>
          </Row>
          <Row gap={space.sm}>
            <Chip tone="hero" label="العربية" selected={locale === 'ar'} onPress={() => setLocale('ar')} />
            <Chip tone="hero" label="English" selected={locale === 'en'} onPress={() => setLocale('en')} />
          </Row>
        </Row>

        <View style={{ flex: 1, justifyContent: 'center', gap: space.xl }}>
          <FadeIn style={{ alignItems: 'center' }}>
            <DrumArt size={250} />
          </FadeIn>
          <FadeIn delay={120} style={{ gap: space.md }}>
            <Text variant="display" weight="bold" color={colors.onHero}>{t.welcome.title}</Text>
            <Text color={colors.onHeroMuted}>{t.welcome.body}</Text>
          </FadeIn>
        </View>

        <View style={{ paddingBottom: space.xl }}>
          <Button variant="onHero" icon={rtl ? 'arrow-left' : 'arrow-right'} label={t.welcome.start} onPress={() => { finishOnboarding(); router.replace('/'); }} />
        </View>
      </Screen>
    </LinearGradient>
  );
}
