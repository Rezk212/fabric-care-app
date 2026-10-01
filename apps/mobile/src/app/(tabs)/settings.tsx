import { countries, space } from '@naqa/shared';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Card, Chip, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Settings() {
  const { t, locale, setLocale, place, session, signOut } = useApp();
  const country = countries.find((c) => c.code === place?.countryCode);
  const city = country?.cities.find((c) => c.id === place?.cityId);
  return (
    <Screen floatingTabs>
      <View style={{ paddingTop: space.xl, gap: space.xl }}>
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
            </Card>
          </FadeIn>
        ) : null}
      </View>
    </Screen>
  );
}
