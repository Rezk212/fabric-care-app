import { Feather } from '@expo/vector-icons';
import { space } from '@naqa/shared';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { Card, FadeIn, IconBubble, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export default function Guide() {
  const { t, colors, rtl } = useApp();
  const items: { icon: FeatherName; title: string; hint: string; href: '/guide/garments' | '/guide/stains' | '/guide/symbols' | '/guide/products' | '/guide/appliances'; tone: 'primary' | 'accent' | 'success' }[] = [
    { icon: 'user', title: t.guide.garments, hint: t.guide.garmentsHint, href: '/guide/garments', tone: 'primary' },
    { icon: 'droplet', title: t.guide.stains, hint: t.guide.stainsHint, href: '/guide/stains', tone: 'accent' },
    { icon: 'tag', title: t.guide.symbols, hint: t.guide.symbolsHint, href: '/guide/symbols', tone: 'success' },
    { icon: 'shopping-bag', title: t.guide.products, hint: t.guide.productsHint, href: '/guide/products', tone: 'primary' },
    { icon: 'settings', title: t.guide.appliances, hint: t.guide.appliancesHint, href: '/guide/appliances', tone: 'accent' },
  ];
  return (
    <Screen floatingTabs>
      <ScrollView contentContainerStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.lg }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: space.sm }}>
          <Text variant="heading" weight="bold">{t.guide.title}</Text>
          <Text muted>{t.guide.subtitle}</Text>
        </View>
        {items.map((it, i) => (
          <FadeIn key={it.href} delay={i * 70}>
            <Pressable accessibilityRole="button" onPress={() => router.push(it.href)}>
              <Card>
                <Row>
                  <IconBubble name={it.icon} tone={it.tone} size={52} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text weight="semibold">{it.title}</Text>
                    <Text variant="caption" muted>{it.hint}</Text>
                  </View>
                  <Feather name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color={colors.inkMuted} />
                </Row>
              </Card>
            </Pressable>
          </FadeIn>
        ))}
      </ScrollView>
    </Screen>
  );
}
