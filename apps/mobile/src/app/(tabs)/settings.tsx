import { countries, space } from '@naqa/shared';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Chip, Row, Screen, Text } from '../../components/ui';
import { useApp } from '../../lib/app-context';

export default function Settings() {
  const { t, locale, setLocale, place } = useApp();
  const country = countries.find((c) => c.code === place?.countryCode);
  const city = country?.cities.find((c) => c.id === place?.cityId);
  return (
    <Screen>
      <View style={{ paddingVertical: space.xl, gap: space.xl }}>
        <Text variant="heading" weight="bold">{t.settings.title}</Text>
        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.settings.language}</Text>
          <Row>
            <Chip label={t.settings.arabic} selected={locale === 'ar'} onPress={() => setLocale('ar')} />
            <Chip label={t.settings.english} selected={locale === 'en'} onPress={() => setLocale('en')} />
          </Row>
        </View>
        <View style={{ gap: space.md }}>
          <Text weight="semibold">{t.settings.place}</Text>
          <Text muted>{[city?.name[locale], country?.name[locale]].filter(Boolean).join('، ')}</Text>
          <Button variant="quiet" label={t.settings.change} onPress={() => router.push('/place')} />
        </View>
      </View>
    </Screen>
  );
}
