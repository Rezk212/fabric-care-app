import { fontWeights, radius, space, typeScale } from '@naqa/shared';
import type { ReactNode } from 'react';
import {
  Pressable, Text as RNText, TextInput, View,
  type StyleProp, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../lib/app-context';

const fontByWeight = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;

type Variant = keyof typeof typeScale;

export function Text({
  variant = 'body', weight = 'regular', muted, color, style, ...rest
}: TextProps & { variant?: Variant; weight?: keyof typeof fontWeights; muted?: boolean; color?: string }) {
  const { colors } = useApp();
  const size = typeScale[variant];
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: fontByWeight[weight],
          fontSize: size,
          lineHeight: Math.round(size * (variant === 'display' || variant === 'heading' ? 1.2 : 1.5)),
          color: color ?? (muted ? colors.inkMuted : colors.ink),
          textAlign: 'auto',
        },
        style,
      ]}
    />
  );
}

/** Root wrapper: sets layout direction so rows and alignment flip for Arabic. */
export function Screen({ children, padded = true, style }: { children: ReactNode; padded?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors, rtl } = useApp();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, direction: rtl ? 'rtl' : 'ltr' }}>
      <View style={[{ flex: 1, paddingHorizontal: padded ? space.xl : 0 }, style]}>{children}</View>
    </SafeAreaView>
  );
}

export function Button({
  label, onPress, variant = 'primary', disabled,
}: { label: string; onPress: () => void; variant?: 'primary' | 'quiet'; disabled?: boolean }) {
  const { colors } = useApp();
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: space.xl,
        backgroundColor: primary ? colors.primary : 'transparent',
        borderWidth: primary ? 0 : 1,
        borderColor: colors.line,
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
      })}
    >
      <Text weight="semibold" color={primary ? colors.primaryInk : colors.ink}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const { colors } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={{
        minHeight: 44,
        paddingHorizontal: space.lg,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.line,
      }}
    >
      <Text weight="medium" color={selected ? colors.primaryInk : colors.ink}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: React.ComponentProps<typeof TextInput>) {
  const { colors } = useApp();
  return (
    <TextInput
      placeholderTextColor={colors.inkMuted}
      {...props}
      style={[{
        minHeight: 52,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.surface,
        paddingHorizontal: space.lg,
        fontFamily: fontByWeight.regular,
        fontSize: typeScale.body,
        color: colors.ink,
        textAlign: 'auto',
      } as TextStyle, props.style]}
    />
  );
}

export function Row({ children, gap = space.md, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}
