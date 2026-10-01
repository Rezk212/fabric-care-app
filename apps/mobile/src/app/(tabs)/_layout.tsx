import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../lib/app-context';

type IconName = React.ComponentProps<typeof Feather>['name'];

export default function TabsLayout() {
  const { t, colors, rtl } = useApp();
  const insets = useSafeAreaInsets();
  const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) =>
    <Feather name={name} size={size} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.surface, borderTopColor: colors.line, direction: rtl ? 'rtl' : 'ltr',
          height: 76 + insets.bottom, paddingTop: 8, paddingBottom: 8 + insets.bottom,
        },
        tabBarLabelStyle: { fontFamily: 'IBMPlexSansArabic_500Medium', fontSize: 12, lineHeight: 18 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.home, tabBarIcon: icon('camera') }} />
      <Tabs.Screen name="stores" options={{ title: t.tabs.stores, tabBarIcon: icon('map-pin') }} />
      <Tabs.Screen name="machines" options={{ title: t.tabs.machines, tabBarIcon: icon('disc') }} />
      <Tabs.Screen name="settings" options={{ title: t.tabs.settings, tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
