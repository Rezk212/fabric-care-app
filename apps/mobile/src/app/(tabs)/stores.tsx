import { countries, format, products, sortByDistance, space, stores } from '@naqa/shared';
import { FlatList, View } from 'react-native';
import { Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Stores() {
  const { t, locale, place, colors } = useApp();
  const city = countries.find((c) => c.code === place?.countryCode)?.cities.find((c) => c.id === place?.cityId);
  const origin = place?.lat != null && place?.lng != null ? { lat: place.lat, lng: place.lng } : city;
  const inCity = stores.filter((s) => s.cityId === place?.cityId);
  const data = origin ? sortByDistance(origin, inCity) : inCity.map((s) => ({ ...s, km: undefined as number | undefined }));

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ paddingVertical: space.xl, gap: space.lg }}
        ListHeaderComponent={<Text variant="heading" weight="bold" style={{ marginBottom: space.md }}>{t.stores.title}</Text>}
        ListEmptyComponent={<Text muted>{t.stores.empty}</Text>}
        renderItem={({ item }) => (
          <View style={{ paddingBottom: space.lg, borderBottomWidth: 1, borderBottomColor: colors.line, gap: space.xs }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text weight="semibold" style={{ flex: 1 }}>{item.name[locale]}</Text>
              {item.isSample ? <Text variant="caption" color={colors.accentText} weight="medium">{t.stores.sample}</Text> : null}
            </Row>
            {item.km != null ? <Text variant="caption" muted>{format(t.stores.away, { km: item.km.toFixed(1) })}</Text> : null}
            <Text variant="caption" muted>
              {item.productIds.map((id) => products.find((p) => p.id === id)?.name[locale]).filter(Boolean).join(' · ')}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}
