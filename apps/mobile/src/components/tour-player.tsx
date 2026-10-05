import { Feather } from '@expo/vector-icons';
import { radius, space, type TourSlide } from '@naqa/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../lib/app-context';
import { TourDemoStage, demoDuration } from './tour-demo';
import { Button, Text } from './ui';

type FeatherName = React.ComponentProps<typeof Feather>['name'];
const SLIDE_MS = 7000;

/** Soft rising bubbles behind the icon, so each slide feels alive like a short video. */
function Bubbles() {
  const items = useMemo(() => [
    { left: '12%', size: 18, delay: 0 }, { left: '30%', size: 10, delay: 900 }, { left: '58%', size: 22, delay: 400 },
    { left: '78%', size: 12, delay: 1300 }, { left: '88%', size: 16, delay: 700 },
  ], []);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, direction: 'ltr' }}>
      {items.map((b, i) => <Bubble key={i} {...b} />)}
    </View>
  );
}
function Bubble({ left, size, delay }: { left: string; size: number; delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 4200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  return (
    <Animated.View style={{
      position: 'absolute', left: left as `${number}%`, bottom: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(255,255,255,0.35)',
      opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.8, 0] }),
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -260] }) }],
    }} />
  );
}

function SlideArt({ icon, index }: { icon: string; index: number }) {
  const pop = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [index, pop]);
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }], opacity: pop }}>
      <Animated.View style={{ position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.1] }) }] }} />
      <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={icon as FeatherName} size={50} color="#3347D6" />
        </View>
      </View>
    </Animated.View>
  );
}

/**
 * Story-style walkthrough: slides advance by themselves (a progress bar shows the time), and people can tap
 * Next / Back, swipe, or skip at any moment. Used for the first-run tour and for each section's guide.
 */
export function TourPlayer({ slides, onClose }: { slides: TourSlide[]; onClose: (completed: boolean) => void }) {
  const { t, locale, rtl, colors } = useApp();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const last = index === slides.length - 1;

  const go = (i: number) => setIndex(Math.max(0, Math.min(slides.length - 1, i)));
  const next = () => (last ? onClose(true) : go(index + 1));

  // Auto-advance, but stay on the last slide so the person can read it and press the button.
  useEffect(() => {
    progress.setValue(0);
    const anim = Animated.timing(progress, { toValue: 1, duration: slides[index].demo ? demoDuration(slides[index].demo) : SLIDE_MS, easing: Easing.linear, useNativeDriver: false });
    anim.start(({ finished }) => { if (finished && index < slides.length - 1) setIndex(index + 1); });
    return () => anim.stop();
  }, [index, progress, slides.length]);

  // Swipe: toward the reading end is "next", so it flips in Arabic.
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 24 && Math.abs(g.dy) < 40,
    onPanResponderRelease: (_, g) => {
      const forward = rtl ? g.dx > 40 : g.dx < -40;
      const backward = rtl ? g.dx < -40 : g.dx > 40;
      if (forward) setIndex((i) => Math.min(slides.length - 1, i + 1));
      else if (backward) setIndex((i) => Math.max(0, i - 1));
    },
  }), [rtl, slides.length]);

  const slide = slides[index];
  return (
    <LinearGradient colors={[colors.heroFrom, colors.heroTo]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={{ flex: 1 }}>
      <View {...pan.panHandlers} style={{ flex: 1, paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.lg, paddingHorizontal: space.xl, direction: rtl ? 'rtl' : 'ltr' }}>
        <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="progressbar">
          {slides.map((s, i) => (
            <View key={s.id} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden' }}>
              {i < index ? <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} /> : null}
              {i === index ? <Animated.View style={{ height: 4, backgroundColor: '#FFFFFF', width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} /> : null}
            </View>
          ))}
        </View>
        <View style={{ alignItems: 'flex-start', paddingTop: space.md }}>
          <Pressable accessibilityRole="button" onPress={() => onClose(false)} hitSlop={12} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text weight="semibold" color="#FFFFFF" style={{ opacity: 0.9 }}>{t.tour.skip}</Text>
          </Pressable>
        </View>

        {slide.demo ? (
          <View style={{ flex: 1, gap: space.lg, paddingTop: space.sm, paddingBottom: space.lg }}>
            <TourDemoStage kind={slide.demo} runKey={`${slide.id}`} />
            <View style={{ gap: space.sm, alignItems: 'center', paddingHorizontal: space.sm, minHeight: 132 }}>
              <Text variant="heading" weight="bold" color="#FFFFFF" style={{ textAlign: 'center' }}>{slide.title[locale]}</Text>
              <Text color="#FFFFFF" style={{ textAlign: 'center', opacity: 0.92 }}>{slide.body[locale]}</Text>
            </View>
          </View>
        ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xxl }}>
          <View style={{ width: '100%', height: 260, alignItems: 'center', justifyContent: 'center' }}>
            <Bubbles />
            <SlideArt icon={slide.icon} index={index} />
          </View>
          <View style={{ gap: space.md, alignItems: 'center', paddingHorizontal: space.sm }}>
            <Text variant="heading" weight="bold" color="#FFFFFF" style={{ textAlign: 'center' }}>{slide.title[locale]}</Text>
            <Text color="#FFFFFF" style={{ textAlign: 'center', opacity: 0.92 }}>{slide.body[locale]}</Text>
          </View>
        </View>
        )}

        <View style={{ flexDirection: 'row', gap: space.md }}>
          <View style={{ flex: 1 }}>
            {index > 0 ? <Button variant="onHero" label={t.tour.back} onPress={() => go(index - 1)} /> : null}
          </View>
          <View style={{ flex: 2 }}>
            <Button variant="onHero" icon={last ? 'check' : rtl ? 'arrow-left' : 'arrow-right'} label={last ? t.tour.start : t.tour.next} onPress={next} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
