import { space } from '@naqa/shared';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ApplianceCard, toDraft, toProfile } from '../components/appliance-card';
import { BackHeader, BottomBack, Button, Text } from '../components/ui';
import { Screen } from '../components/ui';
import { useApp } from '../lib/app-context';
import { goBack } from '../lib/nav';

/** Edit the washer and/or dryer. `kind` limits it to one machine (from the My machines tab). */
export default function Appliances() {
  const { kind } = useLocalSearchParams<{ kind?: 'washer' | 'dryer' }>();
  const { t, washer, dryer, saveProfile } = useApp();
  const [w, setW] = useState(() => toDraft(washer));
  const [d, setD] = useState(() => toDraft(dryer));
  const showWasher = kind !== 'dryer';
  const showDryer = kind !== 'washer';

  function save() {
    saveProfile({ ...(showWasher ? { washer: toProfile(w) } : {}), ...(showDryer ? { dryer: toProfile(d) } : {}) });
    goBack();
  }

  return (
    <Screen>
      <BackHeader title={t.appliances.title} onBack={goBack} />
      <ScrollView contentContainerStyle={{ paddingVertical: space.lg, gap: space.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {showWasher ? <ApplianceCard kind="washer" draft={w} onChange={setW} /> : null}
        {showDryer ? <ApplianceCard kind="dryer" draft={d} onChange={setD} /> : null}
        <Text variant="caption" muted>{t.appliances.editHint}</Text>
      </ScrollView>
      <View style={{ gap: space.sm, paddingBottom: space.lg }}>
        <Button label={t.appliances.save} onPress={save} />
        <BottomBack onPress={goBack} />
      </View>
    </Screen>
  );
}
