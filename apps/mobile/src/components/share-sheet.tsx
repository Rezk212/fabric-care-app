import { Feather } from '@expo/vector-icons';
import { radius, space } from '@naqa/shared';
import { Modal, Pressable, View } from 'react-native';
import { useApp } from '../lib/app-context';
import { shareTo, type Channel, type SharePayload } from '../lib/share';
import { Row, Text } from './ui';

type FeatherName = React.ComponentProps<typeof Feather>['name'];
const CHANNELS: { id: Channel; icon: FeatherName; color: string }[] = [
  { id: 'whatsapp', icon: 'message-circle', color: '#1FAF38' },
  { id: 'telegram', icon: 'send', color: '#2A9AD6' },
  { id: 'x', icon: 'twitter', color: '#111111' },
  { id: 'facebook', icon: 'facebook', color: '#1877F2' },
  { id: 'system', icon: 'more-horizontal', color: '#6B7690' },
];

/** Bottom sheet: pick WhatsApp or a social app, or "more" for the phone's own share sheet. */
export function ShareSheet({ payload, onClose }: { payload: SharePayload | null; onClose: () => void }) {
  const { t, colors, rtl } = useApp();
  const label: Record<Channel, string> = { whatsapp: t.share.whatsapp, telegram: t.share.telegram, x: t.share.x, facebook: t.share.facebook, system: t.share.more };
  return (
    <Modal visible={!!payload} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel={t.settings.cancel} onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(8,14,40,0.5)', justifyContent: 'flex-end' }}>
        <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.xl, paddingBottom: space.xxxl, gap: space.lg, direction: rtl ? 'rtl' : 'ltr' }}>
          <Text variant="title" weight="semibold">{t.share.title}</Text>
          <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }} gap={space.md}>
            {CHANNELS.map((c) => (
              <Pressable key={c.id} accessibilityRole="button" onPress={() => { const p = payload; onClose(); if (p) void shareTo(c.id, p); }}
                style={{ width: '30%', alignItems: 'center', gap: 8, paddingVertical: space.sm }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={c.icon} size={26} color="#FFFFFF" />
                </View>
                <Text variant="caption" style={{ textAlign: 'center' }}>{label[c.id]}</Text>
              </Pressable>
            ))}
          </Row>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
