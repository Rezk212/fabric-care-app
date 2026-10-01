import { Feather } from '@expo/vector-icons';
import { countries, space } from '@naqa/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Chip, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Settings() {
  const { t, locale, setLocale, place, session, signOut, theme, setTheme, deleteAccount, colors, rtl } = useApp();
  const country = countries.find((c) => c.code === place?.countryCode);
  const city = country?.cities.find((c) => c.id === place?.cityId);
  function confirmDelete() {
    Alert.alert(t.settings.deleteTitle, t.settings.deleteBody, [
      { text: t.settings.cancel, style: 'cancel' },
      { text: t.settings.deleteConfirm, style: 'destructive', onPress: async () => {
        if (await deleteAccount()) router.replace('/');
        else Alert.alert(t.settings.deleteFailed);
      } },
    ]);
  }
  const link = (label: string, href: '/legal/privacy' | '/legal/terms') => (
    <Pressable accessibilityRole="button" onPress={() => router.push(href)} style={{ minHeight: 44, justifyContent: 'center' }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text>{label}</Text>
        <Feather name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.inkMuted} />
      </Row>
    </Pressable>
  );
  return (
    <Screen floatingTabs>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.xl }}>
        <Text variant="heading" weight="bold">{t.settings.title}</Text>

        <FadeIn>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="globe" /><Text weight="semibold">{t.settings.language}</Text></Row>
            <Row>
              <Chip label={t.settings.arabic} selected={locale === 'ar'} onPress={() => setLocale('ar')} />
              <Chip label={t.settings.english} selected={locale === 'en'} onPress={() => setLocale('en')} />
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={40}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="sun" tone="accent" /><Text weight="semibold">{t.settings.theme}</Text></Row>
            <Row style={{ flexWrap: 'wrap' }}>
              <Chip label={t.settings.themeAuto} selected={theme === 'auto'} onPress={() => setTheme('auto')} />
              <Chip label={t.settings.themeLight} selected={theme === 'light'} onPress={() => setTheme('light')} />
              <Chip label={t.settings.themeDark} selected={theme === 'dark'} onPress={() => setTheme('dark')} />
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={80}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="map-pin" tone="accent" /><View style={{ flex: 1 }}>
              <Text weight="semibold">{t.settings.place}</Text>
              <Text muted>{[city?.name[locale], country?.name[locale]].filter(Boolean).join('، ')}</Text>
            </View></Row>
            <Button variant="quiet" label={t.settings.change} onPress={() => router.push('/place')} />
          </Card>
        </FadeIn>

        {session ? (
          <FadeIn delay={160}>
            <Card style={{ gap: space.md }}>
              <Row><IconBubble name="user" tone="success" /><View style={{ flex: 1 }}>
                <Text weight="semibold">{t.auth.account}</Text>
                <Text muted>{session.user.email}</Text>
              </View></Row>
              <Button variant="quiet" icon="log-out" label={t.auth.signOut} onPress={async () => { await signOut(); router.replace('/'); }} />
              <Button variant="quiet" icon="trash-2" label={t.settings.deleteAccount} onPress={confirmDelete} />
            </Card>
          </FadeIn>
        ) : null}

        <FadeIn delay={200}>
          <Card style={{ gap: space.xs }}>
            <Row><IconBubble name="shield" tone="success" /><Text weight="semibold">{t.settings.legal}</Text></Row>
            {link(t.settings.privacy, '/legal/privacy')}
            {link(t.settings.terms, '/legal/terms')}
          </Card>
        </FadeIn>

        <FadeIn delay={240}>
          <Card style={{ gap: space.sm }}>
            <Row><IconBubble name="info" /><Text weight="semibold">{t.settings.about}</Text></Row>
            <Text variant="caption" muted>{`${t.settings.version} ${Constants.expoConfig?.version ?? ''}`}</Text>
            <Text variant="caption" muted>{t.settings.disclaimer}</Text>
          </Card>
        </FadeIn>
      </ScrollView>
    </Screen>
  );
}
