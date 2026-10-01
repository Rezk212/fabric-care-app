import { space } from '@naqa/shared';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PhotoSlot } from '../../components/photo-slot';
import { Button, Field, Row, Screen, Text } from '../../components/ui';
import { AnalyzeError, analyzeGarment } from '../../lib/analyze';
import { saveAnalysis } from '../../lib/data';
import { useApp } from '../../lib/app-context';

export default function Analyze() {
  const { t, colors } = useApp();
  const [garmentUri, setGarment] = useState<string>();
  const [labelUri, setLabel] = useState<string>();
  const [machineUri, setMachine] = useState<string>();
  const [modelNumber, setModel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const ready = !!(garmentUri || labelUri);

  async function run() {
    setBusy(true);
    setError(undefined);
    try {
      const { analysis, machine } = await analyzeGarment({ garmentUri, labelUri, machineUri, modelNumber: modelNumber.trim() || undefined });
      void saveAnalysis(analysis, machine);
      router.push({ pathname: '/result', params: { analysis: JSON.stringify(analysis), modelNumber: modelNumber.trim() } });
    } catch (e) {
      const code = e instanceof AnalyzeError ? e.code : 'server';
      setError(t.errors[code]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: space.sm }}>
          <Text variant="heading" weight="bold">{t.home.title}</Text>
          <Text muted>{t.home.subtitle}</Text>
        </View>

        <PhotoSlot label={t.home.garment} hint={t.home.garmentHint} height={176} uri={garmentUri} onChange={setGarment} />

        <Row style={{ alignItems: 'stretch' }} gap={space.md}>
          <PhotoSlot label={t.home.label} hint={t.home.labelHint} uri={labelUri} onChange={setLabel} />
          <PhotoSlot label={t.home.machine} hint={t.home.machineHint2} uri={machineUri} onChange={setMachine} />
        </Row>

        <Field
          value={modelNumber}
          onChangeText={setModel}
          placeholder={t.home.modelNumberOptional}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel={t.home.modelNumberOptional}
        />
      </ScrollView>
      <View style={{ paddingBottom: space.lg }}>
        {!ready && !error ? <Text variant="caption" muted style={{ marginBottom: space.sm }}>{t.home.needPhoto}</Text> : null}
        {error ? <Text color={colors.danger} style={{ marginBottom: space.md }} accessibilityRole="alert">{error}</Text> : null}
        <Button label={busy ? t.home.analyzing : t.home.analyze} onPress={run} disabled={!ready || busy} />
      </View>
    </Screen>
  );
}
