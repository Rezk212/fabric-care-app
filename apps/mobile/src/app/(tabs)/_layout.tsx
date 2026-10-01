import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadow } from '../../components/ui';
import { useApp } from '../../lib/app-context';

type IconName = React.ComponentProps<typeof Feather>['name'];

export default function TabsLayout() {
  const { t, colors, rtl } = useApp();
  const insets = useSafeAreaInsets();
  const shadow = useShadow(0.9);

  const icon = (name: IconName) => ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <View style={{ width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.primarySoft : 'transparent' }}>
      <Feather name={name} size={size - 2} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        // Floating bar: lifted off the edge, content scrolls beneath it (screens reserve space with floatingTabs).
        tabBarStyle: [{
          position: 'absolute', left: 16, right: 16, bottom: Math.max(insets.bottom, 12),
          height: 76, paddingTop: 8, paddingBottom: 8, borderRadius: 32, borderTopWidth: 0,
          backgroundColor: colors.surface, direction: rtl ? 'rtl' : 'ltr',
        }, shadow],
        tabBarLabelStyle: { fontFamily: 'ReadexPro_500Medium', fontSize: 11, lineHeight: 16 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.home, tabBarIcon: icon('camera') }} />
      <Tabs.Screen name="stores" options={{ title: t.tabs.stores, tabBarIcon: icon('map-pin') }} />
      <Tabs.Screen name="machines" options={{ title: t.tabs.machines, tabBarIcon: icon('disc') }} />
      <Tabs.Screen name="settings" options={{ title: t.tabs.settings, tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
