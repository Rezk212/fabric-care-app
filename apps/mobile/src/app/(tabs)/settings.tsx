import { Feather } from '@expo/vector-icons';
import { applianceTypes, countries, space, type ApplianceProfile } from '@naqa/shared';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Chip, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { ShareSheet } from '../../components/share-sheet';
import { appPayload, type SharePayload } from '../../lib/share';

export default function Settings() {
  const { replayIntro, consent, setNotifications, t, locale, setLocale, place, session, signOut, theme, setTheme, deleteAccount, colors, rtl, washer, dryer } = useApp();
  const [sharing, setSharing] = useState<SharePayload | null>(null);
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
  const describe = (p?: ApplianceProfile) => {
    if (!p) return t.appliances.notSet;
    if (p.none) return t.appliances.typeNone;
    const type = p.typeOther ?? applianceTypes.find((a) => a.id === p.typeId)?.name[locale];
    return [type, p.brand, p.model].filter(Boolean).join(' · ') || t.appliances.notSet;
  };
  const link = (label: string, href: '/legal/privacy' | '/legal/terms' | '/legal/disclaimer') => (
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

        <FadeIn delay={60}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="disc" /><Text weight="semibold">{t.appliances.title}</Text></Row>
            <View style={{ gap: 4 }}>
              <Text variant="caption" muted>{`${t.appliances.washer}: ${describe(washer)}`}</Text>
              <Text variant="caption" muted>{`${t.appliances.dryer}: ${describe(dryer)}`}</Text>
            </View>
            <Button variant="quiet" label={t.settings.change} onPress={() => router.push('/appliances')} />
          </Card>
        </FadeIn>

        <FadeIn delay={70}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="user" /><Text weight="semibold">{t.appliances.wardrobeTitle}</Text></Row>
            <Button variant="quiet" label={t.settings.change} onPress={() => router.push('/wardrobe')} />
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

        <FadeIn delay={170}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="bell" tone="accent" /><View style={{ flex: 1 }}>
              <Text weight="semibold">{t.settings.notifications}</Text>
              <Text variant="caption" muted>{t.settings.notificationsHint}</Text>
            </View></Row>
            <Row>
              <Chip label={t.settings.notificationsOn} selected={!!consent?.notifications} onPress={() => setNotifications(true)} />
              <Chip label={t.settings.notificationsOff} selected={!consent?.notifications} onPress={() => setNotifications(false)} />
            </Row>
          </Card>
        </FadeIn>

        <FadeIn delay={175}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="play-circle" /><View style={{ flex: 1 }}>
              <Text weight="semibold">{t.tour.replay}</Text>
              <Text variant="caption" muted>{t.tour.replayHint}</Text>
            </View></Row>
            <Button variant="quiet" icon="play" label={t.tour.replayButton} onPress={() => { replayIntro(); router.replace('/tour'); }} />
          </Card>
        </FadeIn>

        <FadeIn delay={180}>
          <Card style={{ gap: space.md }}>
            <Row><IconBubble name="share-2" tone="accent" /><Text weight="semibold">{t.common.shareApp}</Text></Row>
            <Button variant="quiet" icon="share-2" label={t.common.share} onPress={() => setSharing(appPayload(t))} />
          </Card>
        </FadeIn>

        <FadeIn delay={200}>
          <Card style={{ gap: space.xs }}>
            <Row><IconBubble name="shield" tone="success" /><Text weight="semibold">{t.settings.legal}</Text></Row>
            {link(t.settings.privacy, '/legal/privacy')}
            {link(t.settings.terms, '/legal/terms')}
            {link(t.settings.disclaimerLink, '/legal/disclaimer')}
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
      <ShareSheet payload={sharing} onClose={() => setSharing(null)} />
    </Screen>
  );
}
