import { Feather } from '@expo/vector-icons';
import { Row, IconBubble, Text } from './ui';
import { useApp } from '../lib/app-context';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export function Setting({ icon, label, value, allowed, last }: { icon: FeatherName; label: string; value: string; allowed?: boolean; last?: boolean }) {
  const { colors } = useApp();
  return (
    <Row style={{ minHeight: 60, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <IconBubble name={icon} size={36} tone={allowed === false ? 'accent' : allowed === true ? 'success' : 'primary'} />
      <Text muted style={{ flex: 1 }}>{label}</Text>
      <Row gap={6}>
        {allowed != null ? <Feather name={allowed ? 'check' : 'x'} size={16} color={allowed ? colors.successText : colors.danger} /> : null}
        <Text weight="semibold">{value}</Text>
      </Row>
    </Row>
  );
}
