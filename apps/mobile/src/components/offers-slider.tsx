import { Feather } from '@expo/vector-icons';
import { radius, space, type Offer, type OfferCategory } from '@naqa/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useApp } from '../lib/app-context';
import { fetchOffers } from '../lib/offers';
import { offerPayload, type SharePayload } from '../lib/share';
import { ShareSheet } from './share-sheet';
import { Pill, Row, Text } from './ui';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

const LOOK: Record<OfferCategory, { icon: FeatherName; colors: [string, string] }> = {
  washer: { icon: 'disc', colors: ['#4257E8', '#1B2A8F'] },
  dryer: { icon: 'wind', colors: ['#0F766E', '#134E4A'] },
  detergent: { icon: 'droplet', colors: ['#B45309', '#7C2D12'] },
  softener: { icon: 'cloud', colors: ['#7C3AED', '#4C1D95'] },
};
const GAP = space.md;

export function OffersSlider() {
  const { t, locale, rtl, colors } = useApp();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [sharing, setSharing] = useState<SharePayload | null>(null);
  const scroller = useRef<ScrollView>(null);
  const touching = useRef(false);

  useEffect(() => { void fetchOffers().then(setOffers); }, []);

  // The scroller is always laid out left-to-right; in Arabic the cards are listed in reverse so the first offer sits on the right.
  const n = offers.length;
  const pos = (i: number) => (rtl ? n - 1 - i : i);
  const step = width + GAP;
  const ordered = rtl ? [...offers].reverse() : offers;

  const goTo = (i: number, animated = true) => scroller.current?.scrollTo({ x: pos(i) * step, animated });

  useEffect(() => { if (n > 0 && width > 0) goTo(0, false); }, [n, width, rtl]);

  useEffect(() => {
    if (n < 2 || width === 0) return;
    const id = setInterval(() => {
      if (touching.current) return;
      setIndex((cur) => { const next = (cur + 1) % n; goTo(next); return next; });
    }, 5000);
    return () => clearInterval(id);
  }, [n, width, rtl]);

  if (n === 0) return null;

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    touching.current = false;
    const p = Math.round(e.nativeEvent.contentOffset.x / step);
    setIndex(rtl ? n - 1 - p : p);
  };

  return (
    <View style={{ gap: space.sm }} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      <Text variant="title" weight="semibold">{t.home.offers}</Text>
      {width > 0 ? (
        <View style={{ direction: 'ltr' }}>
          <ScrollView
            ref={scroller}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={step}
            decelerationRate="fast"
            disableIntervalMomentum
            contentContainerStyle={{ gap: GAP }}
            onScrollBeginDrag={() => { touching.current = true; }}
            onMomentumScrollEnd={onEnd}
            onScrollEndDrag={(e) => { if (e.nativeEvent.velocity?.x === 0) onEnd(e); }}
          >
            {ordered.map((o) => {
              const look = LOOK[o.category];
              return (
                <Pressable
                  key={o.id}
                  accessibilityRole={o.linkUrl ? 'link' : 'text'}
                  onPress={() => { if (o.linkUrl) void Linking.openURL(o.linkUrl); }}
                  style={{ width, borderRadius: radius.lg, overflow: 'hidden', direction: rtl ? 'rtl' : 'ltr' }}
                >
                  <LinearGradient colors={look.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: space.lg, minHeight: 148, gap: space.sm, justifyContent: 'space-between' }}>
                    <Feather name={look.icon} size={120} color="#FFFFFF" style={{ position: 'absolute', bottom: -18, [rtl ? 'left' : 'right']: -14, opacity: 0.12 }} />
                    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {o.badge ? <Pill tone="accent" label={o.badge[locale]} /> : <View />}
                      <Pill tone="surface" label={o.isSample ? t.home.offerSample : t.common.sponsored} />
                    </Row>
                    <View style={{ gap: 4 }}>
                      <Text variant="title" weight="bold" color="#FFFFFF">{o.title[locale]}</Text>
                      {o.subtitle ? <Text variant="caption" color="#FFFFFF" style={{ opacity: 0.9 }}>{o.subtitle[locale]}</Text> : null}
                      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
                        <Text variant="caption" color="#FFFFFF" style={{ opacity: 0.85, flex: 1 }}>{o.advertiser ?? ''}</Text>
                        {o.linkUrl ? <Feather name={rtl ? 'arrow-left' : 'arrow-right'} size={18} color="#FFFFFF" /> : null}
                        <Pressable accessibilityRole="button" accessibilityLabel={t.common.share} hitSlop={10}
                          onPress={() => setSharing(offerPayload(o, locale, t))}
                          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)', marginStart: space.sm }}>
                          <Feather name="share-2" size={17} color="#FFFFFF" />
                        </Pressable>
                      </Row>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      {n > 1 ? (
        <Row style={{ justifyContent: 'center' }} gap={6}>
          {offers.map((o, i) => (
            <Pressable key={o.id} accessibilityRole="button" accessibilityLabel={`${i + 1}/${n}`} hitSlop={8} onPress={() => { setIndex(i); goTo(i); }}>
              <View style={{ width: i === index ? 20 : 7, height: 7, borderRadius: 4, backgroundColor: i === index ? colors.primary : colors.line }} />
            </Pressable>
          ))}
        </Row>
      ) : null}
      <ShareSheet payload={sharing} onClose={() => setSharing(null)} />
    </View>
  );
}
