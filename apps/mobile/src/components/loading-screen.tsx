import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/** Branded loading screen: matches the native splash (blue, logo), then breathes while the app gets ready. */
export function LoadingScreen() {
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse, fade]);
  return (
    <LinearGradient colors={['#4257E8', '#1B2A8F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ opacity: fade, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] }) }] }}>
        <Svg width={150} height={150} viewBox="0 0 1024 1024" accessibilityLabel="Naqa">
          <Circle cx="512" cy="512" r="300" fill="none" stroke="#FFFFFF" strokeWidth="64" />
          <Circle cx="512" cy="512" r="236" fill="#FFFFFF" opacity={0.16} />
          <Path d="M330 540c40-70 80 50 120 0s80 50 120 0 80 50 124 0" fill="none" stroke="#F2A93B" strokeWidth="52" strokeLinecap="round" />
          <Path d="M376 440c36-50 66 24 100 0s66 24 100 0" fill="none" stroke="#FFFFFF" strokeWidth="30" strokeLinecap="round" opacity={0.7} />
        </Svg>
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 70, width: 120, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
        <Animated.View style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: '#F2A93B', transform: [{ translateX: pulse.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }) }] }} />
      </View>
    </LinearGradient>
  );
}
