import { space } from '@naqa/shared';
import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { deleteMachine, listAnalyses, listMachines, rowToAnalysis, type AnalysisRow, type MachineRow } from '../../lib/data';
import { backendConfigured } from '../../lib/supabase';

export default function Machines() {
  const { t, locale, colors } = useApp();
  const [machines, setMachines] = useState<MachineRow[]>([]);
  const [history, setHistory] = useState<AnalysisRow[]>([]);

  const load = useCallback(() => {
    void listMachines().then(setMachines);
    void listAnalyses().then(setHistory);
  }, []);
  useFocusEffect(load);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-OM' : 'en-GB');

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: space.xl, gap: space.xl }}>
        <Text variant="heading" weight="bold">{t.machines.title}</Text>
        {!backendConfigured ? <Text muted>{t.machines.localMode}</Text> : null}

        {backendConfigured && machines.length === 0 ? <Text muted>{t.machines.empty}</Text> : null}
        {machines.map((m) => (
          <Row key={m.id} style={{ justifyContent: 'space-between', paddingBottom: space.md, borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <View style={{ flex: 1 }}>
              <Text weight="semibold">{[m.brand, m.model].filter(Boolean).join(' ')}</Text>
              <Text variant="caption" muted>{fmt(m.created_at)}</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={async () => { await deleteMachine(m.id); load(); }} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text weight="medium" color={colors.danger}>{t.machines.remove}</Text>
            </Pressable>
          </Row>
        ))}

        {backendConfigured ? (
          <View style={{ gap: space.md }}>
            <Text weight="semibold">{t.machines.history}</Text>
            {history.length === 0 ? <Text muted>{t.machines.historyEmpty}</Text> : null}
            {history.map((a) => (
              <Pressable
                key={a.id}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/result', params: { analysis: JSON.stringify(rowToAnalysis(a)) } })}
                style={{ minHeight: 44, paddingBottom: space.md, borderBottomWidth: 1, borderBottomColor: colors.line }}
              >
                <Text weight="medium">{t.fabrics[a.fabric as keyof typeof t.fabrics] ?? t.fabrics.unknown}</Text>
                <Text variant="caption" muted>{`${t.programs[a.recommendation.program]} · ${a.recommendation.temperature}°C · ${fmt(a.created_at)}`}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
