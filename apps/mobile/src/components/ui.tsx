import { Feather } from '@expo/vector-icons';
import { fontWeights, radius, space, typeScale } from '@naqa/shared';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated, Easing, Pressable, Text as RNText, TextInput, View,
  type StyleProp, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useApp } from '../lib/app-context';

const fontByWeight = {
  regular: 'ReadexPro_400Regular',
  medium: 'ReadexPro_500Medium',
  semibold: 'ReadexPro_600SemiBold',
  bold: 'ReadexPro_700Bold',
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
          lineHeight: Math.round(size * (variant === 'display' || variant === 'heading' ? 1.25 : 1.55)),
          color: color ?? (muted ? colors.inkMuted : colors.ink),
          textAlign: 'auto',
        },
        style,
      ]}
    />
  );
}

/** Root wrapper: sets layout direction so rows and alignment flip for Arabic. */
export function Screen({
  children, padded = true, style, floatingTabs, background, edges,
}: { children: ReactNode; padded?: boolean; style?: StyleProp<ViewStyle>; floatingTabs?: boolean; background?: string; edges?: Edge[] }) {
  const { colors, rtl } = useApp();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: background ?? colors.bg, direction: rtl ? 'rtl' : 'ltr' }}>
      <View style={[{ flex: 1, paddingHorizontal: padded ? space.xl : 0, paddingBottom: floatingTabs ? 88 : 0 }, style]}>{children}</View>
    </SafeAreaView>
  );
}

/** Entrance: fades and rises once. Respects nothing fancy; short and eased out. */
export function FadeIn({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function useShadow(strength = 1): ViewStyle {
  const { colors, dark } = useApp();
  return {
    shadowColor: colors.shadow,
    shadowOpacity: (dark ? 0.35 : 0.1) * strength,
    shadowRadius: 22 * strength,
    shadowOffset: { width: 0, height: 10 * strength },
    elevation: 6 * strength,
  };
}

export function Card({ children, style, padded = true }: { children: ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  const { colors } = useApp();
  const shadow = useShadow(0.6);
  return (
    <View style={[{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: padded ? space.lg : 0 }, shadow, style]}>
      {children}
    </View>
  );
}

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export function IconBubble({ name, tone = 'primary', size = 44 }: { name: FeatherName; tone?: 'primary' | 'accent' | 'success' | 'hero'; size?: number }) {
  const { colors } = useApp();
  const map = {
    primary: [colors.primarySoft, colors.primary],
    accent: [colors.accentSoft, colors.accentText],
    success: [colors.successSoft, colors.successText],
    hero: ['rgba(255,255,255,0.18)', colors.onHero],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={name} size={Math.round(size * 0.46)} color={fg} />
    </View>
  );
}

export function Pill({ label, tone = 'muted', icon }: { label: string; tone?: 'muted' | 'primary' | 'accent' | 'success' | 'hero' | 'surface'; icon?: FeatherName }) {
  const { colors } = useApp();
  const map = {
    muted: [colors.surfaceMuted, colors.inkMuted],
    primary: [colors.primarySoft, colors.primary],
    accent: [colors.accentSoft, colors.accentText],
    success: [colors.successSoft, colors.successText],
    hero: ['rgba(255,255,255,0.18)', colors.onHero],
    surface: [colors.surface, colors.primary],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
      {icon ? <Feather name={icon} size={13} color={fg} /> : null}
      <Text variant="caption" weight="medium" color={fg}>{label}</Text>
    </View>
  );
}

export function Button({
  label, onPress, variant = 'primary', disabled, icon,
}: { label: string; onPress: () => void; variant?: 'primary' | 'quiet' | 'onHero'; disabled?: boolean; icon?: FeatherName }) {
  const { colors } = useApp();
  const shadow = useShadow(0.8);
  const bg = variant === 'primary' ? colors.primary : variant === 'onHero' ? '#FFFFFF' : 'transparent';
  const fg = variant === 'primary' ? colors.primaryInk : variant === 'onHero' ? '#1B2A8F' : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 56,
          borderRadius: radius.pill,
          flexDirection: 'row',
          gap: space.sm,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: space.xl,
          backgroundColor: bg,
          borderWidth: variant === 'quiet' ? 1 : 0,
          borderColor: colors.line,
          opacity: disabled ? 0.4 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        variant !== 'quiet' && !disabled ? shadow : null,
      ]}
    >
      {icon ? <Feather name={icon} size={18} color={fg} /> : null}
      <Text weight="semibold" color={fg}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, tone = 'default' }: { label: string; selected?: boolean; onPress: () => void; tone?: 'default' | 'hero' }) {
  const { colors } = useApp();
  const hero = tone === 'hero';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        paddingHorizontal: space.lg,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: hero ? (selected ? '#FFFFFF' : 'rgba(255,255,255,0.14)') : selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: hero ? 'rgba(255,255,255,0.35)' : selected ? colors.primary : colors.line,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <Text weight="medium" color={hero ? (selected ? '#1B2A8F' : '#FFFFFF') : selected ? colors.primaryInk : colors.ink}>{label}</Text>
    </Pressable>
  );
}

export function Field({ icon, ...props }: React.ComponentProps<typeof TextInput> & { icon?: FeatherName }) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: space.lg }}>
      {icon ? <Feather name={icon} size={18} color={colors.inkMuted} /> : null}
      <TextInput
        placeholderTextColor={colors.inkMuted}
        {...props}
        style={[{ flex: 1, minHeight: 52, fontFamily: fontByWeight.regular, fontSize: typeScale.body, color: colors.ink, textAlign: 'auto' } as TextStyle, props.style]}
      />
    </View>
  );
}

export function Row({ children, gap = space.md, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

/** Brand mark: a washing drum with a rinse wave. */
export function Logo({ size = 40, color, wave }: { size?: number; color: string; wave: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx="24" cy="24" r="20" stroke={color} strokeWidth="4" fill="none" />
      <Circle cx="24" cy="24" r="11" fill={color} opacity={0.18} />
      <Path d="M12 26c3-5 6 4 9 0s6 4 9 0 4 1 6-1" stroke={wave} strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Welcome-screen illustration: a drum with a fabric swatch and rising bubbles. */
export function DrumArt({ size = 280 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 280 280" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx="140" cy="140" r="128" fill="#FFFFFF" opacity={0.08} />
      <Circle cx="140" cy="140" r="104" fill="none" stroke="#FFFFFF" strokeWidth="10" opacity={0.9} />
      <Circle cx="140" cy="140" r="84" fill="#FFFFFF" opacity={0.12} />
      <Path d="M76 150c14-24 28 16 42 0s28 16 42 0 28 16 42 0" stroke="#F2A93B" strokeWidth="9" strokeLinecap="round" fill="none" />
      <Path d="M92 118c12-18 24 10 36 0s24 10 36 0" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity={0.7} />
      <Circle cx="222" cy="58" r="14" fill="#FFFFFF" opacity={0.28} />
      <Circle cx="246" cy="96" r="7" fill="#FFFFFF" opacity={0.36} />
      <Circle cx="48" cy="70" r="9" fill="#FFFFFF" opacity={0.25} />
      <Circle cx="34" cy="206" r="12" fill="#F2A93B" opacity={0.85} />
    </Svg>
  );
}
