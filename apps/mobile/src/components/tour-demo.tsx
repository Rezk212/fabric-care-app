import { Feather } from '@expo/vector-icons';
import { format, radius, space, type TourDemo } from '@naqa/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useApp } from '../lib/app-context';
import { PhotoSlot } from './photo-slot';
import { Setting } from './setting-row';
import { Button, Card, Chip, Row, Text } from './ui';

/** The demo is drawn at phone width and scaled to fit, so it is the same screen with the same spacing. */
const MOCK_W = 360;
const MOCK_H = 760;

const START_MS = 300;
const TRAVEL_MS = 800;
const TAP_MS = 250;
const HOLD_MS = 1000;
const BUSY_MS = 1300;

/** How long a demo slide stays: the action, then one second with the finished result still on screen. */
export function demoDuration(kind: TourDemo): number {
  const tapAt = START_MS + TRAVEL_MS + TAP_MS;
  return kind === 'analyze' ? tapAt + BUSY_MS + HOLD_MS + 500 : tapAt + 300 + HOLD_MS;
}

function ShirtArt() {
  return (
    <Svg width={110} height={110} viewBox="0 0 84 84">
      <Path d="M28 14l-18 12 8 12 8-5v39h32V33l8 5 8-12-18-12c-3 6-8 9-14 9s-11-3-14-9z" fill="#7FA8E8" stroke="#3347D6" strokeWidth={2.5} strokeLinejoin="round" />
    </Svg>
  );
}
function LabelArt({ kind }: { kind: 'details' | 'symbols' }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 70 70">
      <Rect x={14} y={8} width={42} height={54} rx={5} fill="#FFFFFF" stroke="#3347D6" strokeWidth={2.5} />
      {kind === 'details' ? (
        <>
          <Circle cx={26} cy={24} r={6} fill="none" stroke="#3347D6" strokeWidth={2.5} />
          <Path d="M38 20h10M38 28h10M22 42h26M22 50h20" stroke="#3347D6" strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <Path d="M22 20l8 8M30 20l-8 8M38 24h10M22 42h26M22 50h26" stroke="#3347D6" strokeWidth={2.5} strokeLinecap="round" />
      )}
    </Svg>
  );
}

/** A finger that glides into the middle of whatever it sits in, taps, then fades. */
function Finger({ runKey, onTap }: { runKey: string; onTap: () => void }) {
  const move = useRef(new Animated.Value(0)).current;
  const tap = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    move.setValue(0); tap.setValue(0); fade.setValue(0);
    const run = Animated.sequence([
      Animated.delay(START_MS),
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(move, { toValue: 1, duration: TRAVEL_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(tap, { toValue: 1, duration: TAP_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);
    run.start(({ finished }) => { if (finished) onTap(); });
    return () => run.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);
  const hide = tap.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] });
  return (
    <Animated.View pointerEvents="none" style={{
      position: 'absolute', left: '50%', top: '50%', width: 44, height: 44, marginLeft: -22, marginTop: -22, zIndex: 20,
      opacity: Animated.multiply(fade, hide),
      transform: [
        { translateX: move.interpolate({ inputRange: [0, 1], outputRange: [90, 0] }) },
        { translateY: move.interpolate({ inputRange: [0, 1], outputRange: [110, 0] }) },
        { scale: tap.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.78, 1] }) },
      ],
    }}>
      <View style={{ flex: 1, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', borderWidth: 3, borderColor: '#3347D6', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}>
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#3347D6' }} />
      </View>
    </Animated.View>
  );
}

/** Marks the box the person should use, so the eye lands on it before the finger arrives. */
function Target({ active, height, children }: { active: boolean; height: number; children: ReactNode }) {
  const { colors } = useApp();
  return (
    <View style={{ flex: 1, height, borderRadius: radius.lg, borderWidth: 2, borderColor: active ? colors.primary : 'transparent', padding: active ? 2 : 0 }}>
      {children}
    </View>
  );
}

const SAMPLE = { program: 'cottons', temp: 40 } as const;

/**
 * Scripted walkthrough of the real analyze screen. It uses the same components, so colours, type and spacing match the app.
 * Nothing in it is interactive; `runKey` restarts the script for each slide.
 */
export function TourDemoStage({ kind, runKey }: { kind: TourDemo; runKey: string }) {
  const { t, colors, rtl, locale } = useApp();
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [done, setDone] = useState(false);       // the finger has tapped
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(false);
  const resultFade = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = []; }, [runKey]);

  useEffect(() => { setDone(false); setBusy(false); setResult(false); resultFade.setValue(0); }, [runKey, resultFade]);

  const onTap = () => {
    setDone(true);
    if (kind === 'analyze') {
      setBusy(true);
      const id = setTimeout(() => {
        setBusy(false); setResult(true);
        Animated.timing(resultFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      }, BUSY_MS);
      timers.current.push(id);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const scale = box.w && box.h ? Math.min(box.w / MOCK_W, box.h / MOCK_H) : 0;

  const garment = (kind !== 'garment' && kind !== 'manual') || (kind === 'garment' && done);
  const label = kind === 'label2' || kind === 'analyze' || (kind === 'label' && done);
  const label2 = kind === 'analyze' || (kind === 'label2' && done);
  const manual = kind === 'manual' && done;
  const finger = kind === 'garment' ? 'garment' : kind === 'label' ? 'label' : kind === 'label2' ? 'label2' : kind === 'analyze' ? 'analyze' : 'manual';
  const arrived = (k: string) => finger === k && !done;

  const noop = () => undefined;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={onLayout}>
      {scale > 0 ? (
        <View style={{ width: MOCK_W * scale + 6, height: MOCK_H * scale + 6, borderRadius: 26 * scale + 6, overflow: 'hidden', direction: 'ltr', backgroundColor: colors.bg, borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)' }}>
          <View pointerEvents="none" style={{ width: MOCK_W, height: MOCK_H, transform: [{ translateX: -(MOCK_W * (1 - scale)) / 2 }, { translateY: -(MOCK_H * (1 - scale)) / 2 }, { scale }], direction: rtl ? 'rtl' : 'ltr', backgroundColor: colors.bg, paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.xl }}>
            <View style={{ gap: space.sm }}>
              <Text variant="heading" weight="bold">{t.home.title}</Text>
              <Text muted>{t.home.subtitle}</Text>
            </View>

            <Row style={{ flexWrap: 'wrap' }}>
              <Chip label={t.manual.modePhotos} selected={!manual} onPress={noop} />
              <View>
                <Chip label={t.manual.modeManual} selected={manual} onPress={noop} />
                {finger === 'manual' ? <Finger runKey={runKey} onTap={onTap} /> : null}
              </View>
            </Row>

            {manual ? (
              <View style={{ gap: space.md }}>
                <Text variant="caption" muted>{t.manual.intro}</Text>
                {[[t.manual.stepGarment, t.manual.pickGarment], [t.manual.stepFabric, t.manual.pickFabric], [t.manual.stepColour, t.manual.pickColour]].map(([l, ph]) => (
                  <View key={l} style={{ gap: space.sm }}>
                    <Text weight="semibold">{l}</Text>
                    <View style={{ minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center' }}>
                      <Text muted style={{ flex: 1 }}>{ph}</Text>
                      <Feather name="chevron-down" size={18} color={colors.inkMuted} />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <>
                <Row style={{ alignItems: 'stretch' }}>
                  <Target active={arrived('garment')} height={204}>
                    <PhotoSlot label={t.home.garment} hint={t.home.garmentHint} icon="camera" height={196} onChange={noop} preview={garment ? <ShirtArt /> : undefined} />
                    {finger === 'garment' ? <Finger runKey={runKey} onTap={onTap} /> : null}
                  </Target>
                </Row>
                <Row style={{ alignItems: 'stretch' }} gap={space.md}>
                  <Target active={arrived('label')} height={196}>
                    <PhotoSlot label={t.home.label} hint={t.home.labelHint} icon="tag" height={188} onChange={noop} preview={label ? <LabelArt kind="details" /> : undefined} />
                    {finger === 'label' ? <Finger runKey={runKey} onTap={onTap} /> : null}
                  </Target>
                  <Target active={arrived('label2')} height={196}>
                    <PhotoSlot label={t.home.label2} hint={t.home.label2Hint} icon="file-text" height={188} onChange={noop} preview={label2 ? <LabelArt kind="symbols" /> : undefined} />
                    {finger === 'label2' ? <Finger runKey={runKey} onTap={onTap} /> : null}
                  </Target>
                </Row>
                <View>
                  <Button icon="search" label={busy ? t.home.analyzing : t.home.analyze} onPress={noop} disabled={!garment && !label && !label2} />
                  {finger === 'analyze' ? <Finger runKey={runKey} onTap={onTap} /> : null}
                </View>
              </>
            )}
          </View>

          {result ? (
            <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: resultFade, backgroundColor: colors.bg }}>
              <View style={{ width: MOCK_W, height: MOCK_H, direction: rtl ? 'rtl' : 'ltr', transform: [{ translateX: -(MOCK_W * (1 - scale)) / 2 }, { translateY: -(MOCK_H * (1 - scale)) / 2 }, { scale }], gap: space.xl }}>
                <LinearGradient colors={[colors.heroFrom, colors.heroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ paddingHorizontal: space.xl, paddingTop: space.xl, paddingBottom: space.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, gap: space.lg }}>
                  <Text variant="caption" weight="medium" color={colors.onHeroMuted}>{t.result.title}</Text>
                  <Text variant="display" weight="bold" color={colors.onHero}>{format(t.result.summary, { program: t.programs[SAMPLE.program], temp: SAMPLE.temp })}</Text>
                </LinearGradient>
                <View style={{ paddingHorizontal: space.xl }}>
                  <Card>
                    <Setting icon="thermometer" label={t.result.temperature} value={`${SAMPLE.temp}${locale === 'ar' ? '°م' : '°C'}`} />
                    <Setting icon="sliders" label={t.result.program} value={t.programs[SAMPLE.program]} />
                    <Setting icon="rotate-cw" label={t.result.spin} value={t.levels.medium} />
                    <Setting icon="wind" label={t.result.tumbleDry} value={t.result.no} allowed={false} last />
                  </Card>
                </View>
              </View>
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
