import { space } from '@naqa/shared';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Checkbox, Field, FadeIn, Logo, Row, Screen, Text, TextLink } from '../components/ui';
import { useApp } from '../lib/app-context';

export default function AuthScreen() {
  const { t, signIn, signUp, signInWithGoogle, colors, acceptConsent } = useApp();
  const [agree, setAgree] = useState(false);
  const [notify, setNotify] = useState(false);
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean }>();

  async function submit() {
    setBusy(true);
    setMessage(undefined);
    const res = mode === 'in' ? await signIn(email.trim(), password) : await signUp(email.trim(), password, notify);
    setBusy(false);
    if (!res.ok) return res.error === 'cancelled' ? undefined : setMessage({ text: t.auth[res.error], ok: false });
    if (mode === 'up') acceptConsent(notify);
    if (res.needsConfirmation) { setMode('in'); return setMessage({ text: t.auth.confirmEmail, ok: true }); }
    router.replace('/');
  }

  async function google() {
    setBusy(true);
    setMessage(undefined);
    const res = await signInWithGoogle();
    setBusy(false);
    if (res.ok) { if (mode === 'up') acceptConsent(notify); return router.replace('/'); }
    if (res.error !== 'cancelled') setMessage({ text: t.auth[res.error], ok: false });
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', gap: space.xl }}>
        <FadeIn style={{ gap: space.lg }}>
          <Logo size={48} color={colors.primary} wave={colors.accent} />
          <Text variant="display" weight="bold">{mode === 'in' ? t.auth.signInTitle : t.auth.signUpTitle}</Text>
        </FadeIn>
        <View style={{ gap: space.md }}>
          <Field icon="mail" value={email} onChangeText={setEmail} placeholder={t.auth.email} accessibilityLabel={t.auth.email}
            autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" />
          <Field icon="lock" value={password} onChangeText={setPassword} placeholder={t.auth.password} accessibilityLabel={t.auth.password}
            secureTextEntry autoCapitalize="none" textContentType={mode === 'in' ? 'password' : 'newPassword'} />
        </View>
        {mode === 'up' ? (
          <View style={{ gap: space.sm }}>
            <Checkbox checked={agree} onChange={setAgree}><Text variant="caption" weight="semibold">{t.consent.agree}</Text></Checkbox>
            <Row style={{ flexWrap: 'wrap' }} gap={space.lg}>
              <TextLink label={t.consent.readTerms} onPress={() => router.push('/legal/terms')} />
              <TextLink label={t.consent.readPrivacy} onPress={() => router.push('/legal/privacy')} />
              <TextLink label={t.consent.readDisclaimer} onPress={() => router.push('/legal/disclaimer')} />
            </Row>
            <Checkbox checked={notify} onChange={setNotify} hint={t.consent.notifyHint}><Text variant="caption">{t.consent.notify}</Text></Checkbox>
          </View>
        ) : null}
        {message ? (
          <Text accessibilityRole="alert" color={message.ok ? colors.successText : colors.danger}>{message.text}</Text>
        ) : null}
        <View style={{ gap: space.md }}>
          <Button variant="quiet" label={t.auth.google} onPress={google} disabled={busy || (mode === 'up' && !agree)} />
          <Text variant="caption" muted style={{ textAlign: 'center' }}>{t.auth.or}</Text>
          <Button label={mode === 'in' ? t.auth.signIn : t.auth.signUp} onPress={submit} disabled={busy || !email || password.length < 6 || (mode === 'up' && !agree)} />
          <Button variant="quiet" label={mode === 'in' ? t.auth.toSignUp : t.auth.toSignIn}
            onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setMessage(undefined); }} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
