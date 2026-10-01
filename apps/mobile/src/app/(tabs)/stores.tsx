import { Feather } from '@expo/vector-icons';
import { countries, format, products, sortByDistance, space, stores } from '@naqa/shared';
import { FlatList, View } from 'react-native';
import { Card, FadeIn, IconBubble, Pill, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Stores() {
  const { t, locale, place, colors } = useApp();
  const city = countries.find((c) => c.code === place?.countryCode)?.cities.find((c) => c.id === place?.cityId);
  const origin = place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : city;
  const inCity = stores.filter((s) => s.cityId === place?.cityId);
  const data = origin ? sortByDistance(origin, inCity) : inCity.map((s) => ({ ...s, km: undefined as number | undefined }));

  return (
    <Screen floatingTabs>
      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.md }}
        ListHeaderComponent={
          <View style={{ gap: space.xs, marginBottom: space.md }}>
            <Text variant="heading" weight="bold">{t.stores.title}</Text>
            {city ? <Text muted>{city.name[locale]}</Text> : null}
          </View>
        }
        ListEmptyComponent={<Text muted>{t.stores.empty}</Text>}
        renderItem={({ item, index }) => (
          <FadeIn delay={index * 60}>
            <Card style={{ gap: space.md }}>
              <Row style={{ alignItems: 'flex-start' }}>
                <IconBubble name="shopping-bag" tone="primary" />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text weight="semibold">{item.name[locale]}</Text>
                  {item.km != null ? (
                    <Row gap={6}>
                      <Feather name="navigation" size={13} color={colors.inkMuted} />
                      <Text variant="caption" muted>{format(t.stores.away, { km: item.km.toFixed(1) })}</Text>
                    </Row>
                  ) : null}
                </View>
              </Row>
              <Row style={{ flexWrap: 'wrap' }} gap={space.sm}>
                {item.isSponsored ? <Pill tone="accent" label={t.common.sponsored} /> : null}
                {item.isSample ? <Pill tone="muted" label={t.stores.sample} /> : null}
              </Row>
              <Text variant="caption" muted>
                {item.productIds.map((id) => products.find((p) => p.id === id)?.name[locale]).filter(Boolean).join(' · ')}
              </Text>
            </Card>
          </FadeIn>
        )}
      />
    </Screen>
  );
}
