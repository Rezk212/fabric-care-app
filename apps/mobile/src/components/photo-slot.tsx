import { Feather } from '@expo/vector-icons';
import { radius, space } from '@naqa/shared';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, View } from 'react-native';
import { useApp } from '../lib/app-context';
import { Text } from './ui';

export function PhotoSlot({ label, uri, onChange }: { label: string; uri?: string; onChange: (uri?: string) => void }) {
  const { colors, t } = useApp();

  async function pick(source: 'camera' | 'library') {
    const perm = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
    const res = source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (!res.canceled) onChange(res.assets[0]?.uri);
  }

  function open() {
    Alert.alert(label, undefined, [
      { text: t.photo.camera, onPress: () => pick('camera') },
      { text: t.photo.library, onPress: () => pick('library') },
      ...(uri ? [{ text: t.photo.remove, style: 'destructive' as const, onPress: () => onChange(undefined) }] : []),
      { text: t.photo.cancel, style: 'cancel' as const },
    ]);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={open}
      style={{
        flex: 1,
        minHeight: 132,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderStyle: uri ? 'solid' : 'dashed',
        borderColor: colors.line,
        backgroundColor: colors.surface,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space.md,
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <Feather name="camera" size={24} color={colors.primary} />
          <Text variant="caption" weight="medium" style={{ textAlign: 'center' }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
