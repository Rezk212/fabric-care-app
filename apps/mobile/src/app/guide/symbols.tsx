import { CHECK_LABEL_NOTE, space, symbolGuide } from '@naqa/shared';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { BackHeader, BottomBack, Card, Row, Screen, SymbolGlyph, Text } from '../../components/ui';
import { goBack } from '../../lib/nav';
import { useApp } from '../../lib/app-context';

export default function Symbols() {
  const { t, locale, colors } = useApp();
  return (
    <Screen>
      <BackHeader title={t.guide.symbols} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg }} showsVerticalScrollIndicator={false}>
        <Card padded={false} style={{ paddingHorizontal: space.lg }}>
          {symbolGuide.map((s, i) => (
            <Row key={i} style={{ minHeight: 68, borderBottomWidth: i === symbolGuide.length - 1 ? 0 : 1, borderBottomColor: colors.line }}>
              <SymbolGlyph kind={s.kind} level={s.level} banned={s.banned} />
              <Text style={{ flex: 1 }}>{s.text[locale]}</Text>
            </Row>
          ))}
        </Card>
        <Text variant="caption" muted style={{ marginTop: space.lg }}>{CHECK_LABEL_NOTE[locale]}</Text>
      </ScrollView>
      <BottomBack onPress={goBack} />
    </Screen>
  );
}
