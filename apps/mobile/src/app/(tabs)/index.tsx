import { space } from '@naqa/shared';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PhotoSlot } from '../../components/photo-slot';
import { Button, Field, Row, Screen, Text } from '../../components/ui';
import { analyzeGarment } from '../../lib/analyze';
import { useApp } from '../../lib/app-context';

export default function Analyze() {
  const { t } = useApp();
  const [garmentUri, setGarment] = useState<string>();
  const [labelUri, setLabel] = useState<string>();
  const [machineUri, setMachine] = useState<string>();
  const [modelNumber, setModel] = useState('');
  const [busy, setBusy] = useState(false);

  const ready = !!(garmentUri || labelUri);

  async function run() {
    setBusy(true);
    try {
      const analysis = await analyzeGarment({ garmentUri, labelUri, machineUri, modelNumber: modelNumber.trim() || undefined });
      router.push({ pathname: '/result', params: { analysis: JSON.stringify(analysis), modelNumber: modelNumber.trim() } });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.xl, paddingVertical: space.xl }} keyboardShouldPersistTaps="handled">
        <Text variant="heading" weight="bold">{t.home.title}</Text>

        <Row style={{ alignItems: 'stretch' }} gap={space.md}>
          <PhotoSlot label={t.home.garment} uri={garmentUri} onChange={setGarment} />
          <PhotoSlot label={t.home.label} uri={labelUri} onChange={setLabel} />
        </Row>

        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.home.machine}</Text>
          <Text variant="caption" muted>{t.home.machineHint}</Text>
          <Row style={{ alignItems: 'stretch' }} gap={space.md}>
            <View style={{ flex: 1 }}>
              <PhotoSlot label={t.home.machine} uri={machineUri} onChange={setMachine} />
            </View>
            <View style={{ flex: 1.3, justifyContent: 'center' }}>
              <Field
                value={modelNumber}
                onChangeText={setModel}
                placeholder={t.home.modelNumber}
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel={t.home.modelNumber}
              />
            </View>
          </Row>
        </View>
      </ScrollView>
      <View style={{ paddingBottom: space.lg }}>
        <Button label={t.home.analyze} onPress={run} disabled={!ready || busy} />
      </View>
    </Screen>
  );
}
