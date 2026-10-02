import { format, space, type UsageInfo } from '@naqa/shared';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ManualForm } from '../../components/manual-form';
import { OffersSlider } from '../../components/offers-slider';
import { PhotoSlot } from '../../components/photo-slot';
import { Button, Chip, FadeIn, Field, Pill, Row, Screen, Text } from '../../components/ui';
import { AnalyzeError, analyzeGarment, fetchUsage } from '../../lib/analyze';
import { useApp } from '../../lib/app-context';
import { saveAnalysis } from '../../lib/data';

export default function Analyze() {
  const { t, colors } = useApp();
  const [garmentUri, setGarment] = useState<string>();
  const [labelUri, setLabel] = useState<string>();
  const [machineUri, setMachine] = useState<string>();
  const [modelNumber, setModel] = useState('');
  const [mode, setMode] = useState<'photos' | 'manual'>('photos');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  useFocusEffect(useCallback(() => { void fetchUsage().then(setUsage); }, []));
  const left = usage ? Math.max(usage.limit - usage.used, 0) : null;
  const exhausted = left === 0;

  const ready = !!(garmentUri || labelUri) && !exhausted;

  async function run() {
    setBusy(true);
    setError(undefined);
    try {
      const { analysis, machine, usage: used } = await analyzeGarment({ garmentUri, labelUri, machineUri, modelNumber: modelNumber.trim() || undefined });
      if (used) setUsage(used);
      void saveAnalysis(analysis, machine);
      router.push({ pathname: '/result', params: { analysis: JSON.stringify(analysis), modelNumber: modelNumber.trim(), machinePrograms: JSON.stringify(machine?.programs ?? []) } });
    } catch (e) {
      const code = e instanceof AnalyzeError ? e.code : 'server';
      if (e instanceof AnalyzeError && e.usage) setUsage(e.usage);
      setError(t.errors[code]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen floatingTabs>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingTop: space.xl, paddingBottom: space.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FadeIn style={{ gap: space.sm }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text variant="heading" weight="bold" style={{ flex: 1 }}>{t.home.title}</Text>
            {usage ? <Pill tone={exhausted ? 'accent' : 'primary'} icon="zap" label={`${left}/${usage.limit}`} /> : null}
          </Row>
          <Text muted>{t.home.subtitle}</Text>
        </FadeIn>

        <FadeIn delay={40}>
          <OffersSlider />
        </FadeIn>

        <FadeIn delay={60}>
          <Row style={{ flexWrap: 'wrap' }}>
            <Chip label={t.manual.modePhotos} selected={mode === 'photos'} onPress={() => setMode('photos')} />
            <Chip label={t.manual.modeManual} selected={mode === 'manual'} onPress={() => setMode('manual')} />
          </Row>
        </FadeIn>

        {mode === 'manual' ? <ManualForm onUsePhotos={() => setMode('photos')} /> : (
          <>
          <FadeIn delay={80}>
            <PhotoSlot label={t.home.garment} hint={t.home.garmentHint} icon="camera" height={200} uri={garmentUri} onChange={setGarment} />
          </FadeIn>

          <FadeIn delay={140}>
            <Row style={{ alignItems: 'stretch' }} gap={space.md}>
              <PhotoSlot label={t.home.label} hint={t.home.labelHint} icon="tag" height={168} uri={labelUri} onChange={setLabel} />
              <PhotoSlot label={t.home.machine} hint={t.home.machineHint2} icon="disc" height={168} uri={machineUri} onChange={setMachine} />
            </Row>
          </FadeIn>

          <FadeIn delay={200}>
            <Field
              icon="hash"
              value={modelNumber}
              onChangeText={setModel}
              placeholder={t.home.modelNumberOptional}
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel={t.home.modelNumberOptional}
            />
          </FadeIn>

          <View style={{ gap: space.sm }}>
            {usage ? (
              <Text variant="caption" muted>{exhausted ? t.home.quotaReached : format(t.home.usageLeft, { left: left ?? 0, limit: usage.limit })}</Text>
            ) : null}
            {!ready && !error && !exhausted ? <Text variant="caption" muted>{t.home.needPhoto}</Text> : null}
            {error ? <Text color={colors.danger} accessibilityRole="alert">{error}</Text> : null}
          </View>
          </>
        )}
      </ScrollView>

      {mode === 'photos' ? (
        <View style={{ gap: space.sm, paddingBottom: space.md }}>
          <Button icon="search" label={busy ? t.home.analyzing : t.home.analyze} onPress={run} disabled={!ready || busy} />
        </View>
      ) : null}
    </Screen>
  );
}
