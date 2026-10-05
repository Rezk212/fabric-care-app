import { space } from '@naqa/shared';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Checkbox, FadeIn, IconBubble, Row, Screen, Text, TextLink } from '../components/ui';
import { useApp } from '../lib/app-context';

/** Shown to everyone who has not accepted the current terms, privacy policy and disclaimer. */
export default function Consent() {
  const { t, signOut, acceptConsent } = useApp();
  const [agree, setAgree] = useState(false);
  const [notify, setNotify] = useState(false);
  const points = [t.consent.p1, t.consent.p2, t.consent.p3, t.consent.p4];
  const links: { label: string; href: '/legal/terms' | '/legal/privacy' | '/legal/disclaimer' }[] = [
    { label: t.consent.readTerms, href: '/legal/terms' },
    { label: t.consent.readPrivacy, href: '/legal/privacy' },
    { label: t.consent.readDisclaimer, href: '/legal/disclaimer' },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: space.xl, gap: space.lg }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.sm }}>
          <Text variant="heading" weight="bold">{t.consent.title}</Text>
          <Text muted>{t.consent.intro}</Text>
        </View>
        <FadeIn>
          <Card style={{ gap: space.md }}>
            {points.map((p, i) => (
              <Row key={i} gap={space.md} style={{ alignItems: 'flex-start' }}>
                <IconBubble name="info" size={32} tone={i === 2 ? 'accent' : 'primary'} />
                <Text style={{ flex: 1 }}>{p}</Text>
              </Row>
            ))}
          </Card>
        </FadeIn>
        <Row style={{ flexWrap: 'wrap' }} gap={space.lg}>
          {links.map((l) => <TextLink key={l.href} label={l.label} onPress={() => router.push(l.href)} />)}
        </Row>
        <Checkbox checked={agree} onChange={setAgree}><Text weight="semibold">{t.consent.agree}</Text></Checkbox>
        <Checkbox checked={notify} onChange={setNotify} hint={t.consent.notifyHint}><Text>{t.consent.notify}</Text></Checkbox>
      </ScrollView>
      <View style={{ gap: space.sm, paddingBottom: space.lg }}>
        {!agree ? <Text variant="caption" muted>{t.consent.needAgree}</Text> : null}
        <Button label={t.consent.accept} disabled={!agree} onPress={() => { acceptConsent(notify); router.replace('/'); }} />
        <Button variant="quiet" label={t.consent.decline} onPress={async () => { await signOut(); router.replace('/'); }} />
      </View>
    </Screen>
  );
}
