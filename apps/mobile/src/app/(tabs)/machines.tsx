import { Feather } from '@expo/vector-icons';
import { space } from '@naqa/shared';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Card, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';
import { deleteMachine, listAnalyses, listMachines, rowToAnalysis, type AnalysisRow, type MachineRow } from '../../lib/data';
import { backendConfigured } from '../../lib/supabase';

export default function Machines() {
  const { t, locale, colors, rtl } = useApp();
  const [machines, setMachines] = useState<MachineRow[]>([]);
  const [history, setHistory] = useState<AnalysisRow[]>([]);

  const load = useCallback(() => {
    void listMachines().then(setMachines);
    void listAnalyses().then(setHistory);
  }, []);
  useFocusEffect(load);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-OM' : 'en-GB');

  return (
    <Screen floatingTabs>
      <ScrollView contentContainerStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.xl }} showsVerticalScrollIndicator={false}>
        <Text variant="heading" weight="bold">{t.machines.title}</Text>

        {!backendConfigured ? (
          <Card style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
            <IconBubble name="info" tone="accent" />
            <Text muted style={{ flex: 1 }}>{t.machines.localMode}</Text>
          </Card>
        ) : null}

        {backendConfigured && machines.length === 0 ? <Text muted>{t.machines.empty}</Text> : null}
        {machines.map((m, i) => (
          <FadeIn key={m.id} delay={i * 50}>
            <Card>
              <Row>
                <IconBubble name="disc" />
                <View style={{ flex: 1 }}>
                  <Text weight="semibold">{[m.brand, m.model].filter(Boolean).join(' ')}</Text>
                  <Text variant="caption" muted>{fmt(m.created_at)}</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={t.machines.remove} onPress={async () => { await deleteMachine(m.id); load(); }} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="trash-2" size={20} color={colors.danger} />
                </Pressable>
              </Row>
            </Card>
          </FadeIn>
        ))}

        {backendConfigured ? (
          <View style={{ gap: space.md }}>
            <Text variant="title" weight="semibold">{t.machines.history}</Text>
            {history.length === 0 ? <Text muted>{t.machines.historyEmpty}</Text> : null}
            {history.map((a) => (
              <Pressable
                key={a.id}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/result', params: { analysis: JSON.stringify(rowToAnalysis(a)) } })}
              >
                <Card>
                  <Row>
                    <IconBubble name="layers" tone="success" />
                    <View style={{ flex: 1 }}>
                      <Text weight="semibold">{t.fabrics[a.fabric as keyof typeof t.fabrics] ?? t.fabrics.unknown}</Text>
                      <Text variant="caption" muted>{`${t.programs[a.recommendation.program]} · ${a.recommendation.temperature}${locale === 'ar' ? '°م' : '°C'} · ${fmt(a.created_at)}`}</Text>
                    </View>
                    <Feather name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.inkMuted} />
                  </Row>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
