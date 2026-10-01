import { space } from '@naqa/shared';
import { View } from 'react-native';
import { Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Machines() {
  const { t } = useApp();
  return (
    <Screen>
      <View style={{ paddingVertical: space.xl, gap: space.md }}>
        <Text variant="heading" weight="bold">{t.machines.title}</Text>
        <Text muted>{t.machines.empty}</Text>
      </View>
    </Screen>
  );
}
