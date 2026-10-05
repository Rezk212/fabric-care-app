import { Feather } from '@expo/vector-icons';
import { radius, space } from '@naqa/shared';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { useApp } from '../lib/app-context';
import { IconBubble, Pill, Text, useShadow } from './ui';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export function PhotoSlot({
  label, hint, icon = 'camera', height = 132, uri, onChange, preview,
}: { label: string; hint?: string; icon?: FeatherName; height?: number; uri?: string; onChange: (uri?: string) => void; preview?: ReactNode }) {
  const { colors, t } = useApp();
  const shadow = useShadow(0.6);

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
      style={({ pressed }) => [
        {
          flex: 1,
          minHeight: height,
          borderRadius: radius.lg,
          backgroundColor: uri || preview ? colors.surfaceMuted : colors.primarySoft,
          overflow: 'hidden',
          justifyContent: 'center',
          padding: space.lg,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        uri || preview ? shadow : null,
      ]}
    >
      {uri || preview ? (
        <>
          {preview ? <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>{preview}</View> : <Image source={{ uri }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />}
          <LinearGradient colors={['transparent', 'rgba(8,14,40,0.62)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' }} />
          <View style={{ position: 'absolute', left: space.lg, right: space.lg, bottom: space.md, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
            <Text weight="semibold" color="#FFFFFF" variant="caption" >{label}</Text>
            <Pill label={t.photo.retake} tone="hero" icon="edit-2" />
          </View>
        </>
      ) : (
        <View style={{ gap: space.md, alignItems: 'flex-start' }}>
          <IconBubble name={icon} />
          <View style={{ gap: 2 }}>
            <Text weight="semibold">{label}</Text>
            {hint ? <Text variant="caption" muted>{hint}</Text> : null}
          </View>
          <Pill tone="surface" icon="plus" label={t.photo.add} />
        </View>
      )}
    </Pressable>
  );
}
