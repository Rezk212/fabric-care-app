import { Feather } from '@expo/vector-icons';
import { fontWeights, radius, space, typeScale, type SymbolKind } from '@naqa/shared';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated, Easing, Pressable, Text as RNText, TextInput, View,
  type StyleProp, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useApp } from '../lib/app-context';

const fontByWeight = {
  regular: 'ReadexPro_400Regular',
  medium: 'ReadexPro_500Medium',
  semibold: 'ReadexPro_600SemiBold',
  bold: 'ReadexPro_700Bold',
} as const;

type Variant = keyof typeof typeScale;

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
/** Arabic text reads with Arabic-Indic digits. Numbers inside Latin words (model codes like WW90T) are left alone. */
function toArabicDigits(text: string): string {
  return text.replace(/\b\d+(?:\.\d+)?\b/g, (n) => n.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]).replace('.', '٫'));
}
function localizeChildren(children: ReactNode): ReactNode {
  if (typeof children === 'string') return toArabicDigits(children);
  if (typeof children === 'number') return toArabicDigits(String(children));
  if (Array.isArray(children)) return children.map((c) => (typeof c === 'string' || typeof c === 'number' ? localizeChildren(c) : c));
  return children;
}

export function Text({
  variant = 'body', weight = 'regular', muted, color, style, ...rest
}: TextProps & { variant?: Variant; weight?: keyof typeof fontWeights; muted?: boolean; color?: string }) {
  const { colors, rtl } = useApp();
  const size = typeScale[variant];
  return (
    <RNText
      {...rest}
      children={rtl ? localizeChildren(rest.children) : rest.children}
      style={[
        {
          fontFamily: fontByWeight[weight],
          fontSize: size,
          lineHeight: Math.round(size * (variant === 'display' || variant === 'heading' ? 1.25 : 1.55)),
          color: color ?? (muted ? colors.inkMuted : colors.ink),
          // React Native flips 'left'/'right' on its own when the screen direction is RTL, so 'left' always means
          // "start of the line": right in Arabic, left in English. ('auto' ignored the app language on iOS.)
          textAlign: 'left',
          writingDirection: rtl ? 'rtl' : 'ltr',
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
      <View style={[{ flex: 1, paddingHorizontal: padded ? space.xl : 0, paddingBottom: floatingTabs ? 88 : 0 }, style]}>
        {floatingTabs ? <AppBar /> : null}
        {children}
      </View>
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
  const { colors, rtl } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: space.lg }}>
      {icon ? <Feather name={icon} size={18} color={colors.inkMuted} /> : null}
      <TextInput
        placeholderTextColor={colors.inkMuted}
        {...props}
        style={[{ flex: 1, minHeight: 52, fontFamily: fontByWeight.regular, fontSize: typeScale.body, color: colors.ink, textAlign: 'auto', writingDirection: rtl ? 'rtl' : 'ltr' } as TextStyle, props.style]}
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

/** Screen header with a back arrow that points the right way in Arabic. */
export function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { colors, rtl } = useApp();
  return (
    <Row style={{ paddingTop: space.lg, paddingBottom: space.sm }} gap={space.sm}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}
      >
        <Feather name={rtl ? 'arrow-right' : 'arrow-left'} size={20} color={colors.ink} />
      </Pressable>
      <Text variant="title" weight="semibold" style={{ flex: 1 }}>{title}</Text>
    </Row>
  );
}

/** Simplified drawings of the ISO care symbols. Meaning is always shown as text beside them. */
export function SymbolGlyph({ kind, level, banned, size = 44 }: { kind: SymbolKind; level?: number; banned?: boolean; size?: number }) {
  const { colors } = useApp();
  const c = colors.ink;
  const stroke = { stroke: c, strokeWidth: 2.4, fill: 'none', strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const tub = <Path d="M8 14 H40 L36 38 H12 Z" {...stroke} />;
  let body: React.ReactNode;
  switch (kind) {
    case 'wash':
    case 'gentle':
    case 'nowash':
      body = (<>
        {tub}
        <Path d="M12 22c3-3 5 3 8 0s5 3 8 0 5 3 8 0" {...stroke} />
        {level ? <SvgText x="24" y="35" fontSize="10" fontWeight="700" fill={c} textAnchor="middle">{level}</SvgText> : null}
        {kind === 'gentle' ? <Path d="M10 43 H38" {...stroke} /> : null}
      </>);
      break;
    case 'handwash':
      body = (<>{tub}<Path d="M19 33 v-7 M23 33 v-9 M27 33 v-8 M31 33 v-6" {...stroke} /></>);
      break;
    case 'bleach':
    case 'nobleach':
    case 'bleach_oxygen':
      body = (<>
        <Path d="M24 8 L42 40 H6 Z" {...stroke} />
        {kind === 'bleach_oxygen' ? <Path d="M17 34 L26 18 M24 36 L31 24" {...stroke} /> : null}
      </>);
      break;
    case 'tumble':
    case 'notumble':
      body = (<><Path d="M8 8 H40 V40 H8 Z" {...stroke} /><Circle cx="24" cy="24" r="11" {...stroke} /></>);
      break;
    case 'iron':
    case 'noiron':
      body = (<>
        <Path d="M8 36 H40 C40 26 34 18 26 18 H12 Z" {...stroke} />
        {Array.from({ length: Math.min(3, level ?? 0) }).map((_, i) => <Circle key={i} cx={19 + i * 5} cy="28" r="1.6" fill={c} />)}
      </>);
      break;
    case 'dryclean':
    case 'nodryclean':
      body = <Circle cx="24" cy="24" r="16" {...stroke} />;
      break;
    case 'linedry':
      body = (<><Path d="M8 8 H40 V40 H8 Z" {...stroke} /><Path d="M24 8 V26" {...stroke} /></>);
      break;
    case 'dripdry':
      body = (<><Path d="M8 8 H40 V40 H8 Z" {...stroke} /><Path d="M17 14 V34 M24 14 V34 M31 14 V34" {...stroke} /></>);
      break;
    case 'dryflat':
      body = (<><Path d="M8 8 H40 V40 H8 Z" {...stroke} /><Path d="M13 24 H35" {...stroke} /></>);
      break;
    case 'shade':
      body = (<><Path d="M8 8 H40 V40 H8 Z" {...stroke} /><Path d="M8 8 L18 18" {...stroke} /></>);
      break;
    default:
      body = (<><Circle cx="24" cy="24" r="16" {...stroke} /><Path d="M24 22 V32 M24 16 V17" {...stroke} /></>);
  }
  const showCross = banned || kind === 'nowash' || kind === 'nobleach' || kind === 'notumble' || kind === 'noiron' || kind === 'nodryclean' || kind === 'nowring';
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {body}
      {showCross ? <Path d="M6 6 L42 42 M42 6 L6 42" stroke={colors.danger} strokeWidth="3" strokeLinecap="round" /> : null}
    </Svg>
  );
}

/** Sticky back button for the bottom of a screen: easy to reach with a thumb, and never hidden under overlays. */
export function BottomBack({ onPress }: { onPress: () => void }) {
  const { t, rtl } = useApp();
  return (
    <View style={{ paddingTop: space.sm, paddingBottom: space.lg }}>
      <Button variant="quiet" icon={rtl ? 'arrow-right' : 'arrow-left'} label={t.result.back} onPress={onPress} />
    </View>
  );
}

/** Product picture: the partner-supplied photo when there is one, otherwise a simple bottle drawing for its kind. */
export function ProductThumb({ imageUrl, kind, size = 64 }: { imageUrl?: string; kind: string; size?: number }) {
  const { colors } = useApp();
  const tint = kind === 'bleach' ? '#3FA9D6' : kind === 'color_care' ? '#D9578C' : kind === 'softener' ? '#8E7CF0' : kind === 'stain_remover' ? '#E5604D' : kind === 'wool_wash' || kind === 'delicate_wash' ? '#F2A93B' : colors.primary;
  const box = { width: size, height: size, borderRadius: radius.md, backgroundColor: colors.surfaceMuted, alignItems: 'center' as const, justifyContent: 'center' as const, overflow: 'hidden' as const };
  if (imageUrl) return <Image source={{ uri: imageUrl }} style={box} resizeMode="contain" accessibilityIgnoresInvertColors />;
  return (
    <View style={box}>
      <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 40 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Path d="M16 4h8v4l3 3v22a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V11l3-3z" fill={tint} opacity={0.9} />
        <Path d="M13 20h14v8H13z" fill="#FFFFFF" opacity={0.85} />
        <Path d="M15 24c2-2 3 2 5 0s3 2 5 0" stroke={tint} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

/** Top bar of the main tabs: the app logo and name, ready for a future notifications or profile action. */
export function AppBar() {
  const { colors, locale } = useApp();
  const ar = locale === 'ar';
  // Follows the reading direction: logo at the start (right in Arabic, left in English), name beside it.
  // Arabic letters sit a little smaller than Latin at the same size, so the Arabic name gets a slight bump.
  return (
    <View style={{ direction: ar ? 'rtl' : 'ltr', flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingTop: space.md, paddingBottom: space.xs }}>
      <Logo size={34} color={colors.primary} wave={colors.accent} />
      <Text variant="title" weight="bold" color={colors.primary} style={{ fontSize: ar ? 24 : 21, lineHeight: 30, writingDirection: ar ? 'rtl' : 'ltr' }}>{ar ? 'نقاء' : 'Naqa'}</Text>
    </View>
  );
}

/** Tick box with a label. `required` only affects how the label is announced. */
export function Checkbox({ checked, onChange, children, hint }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; hint?: string }) {
  const { colors } = useApp();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.md, minHeight: 44 }}>
      <Feather name={checked ? 'check-square' : 'square'} size={24} color={checked ? colors.primary : colors.inkMuted} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 2 }}>
        {children}
        {hint ? <Text variant="caption" muted>{hint}</Text> : null}
      </View>
    </Pressable>
  );
}

/** Small underlined link-style text. */
export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useApp();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={{ minHeight: 32, justifyContent: 'center' }}>
      <Text variant="caption" weight="semibold" color={colors.primary} style={{ textDecorationLine: 'underline' }}>{label}</Text>
    </Pressable>
  );
}
