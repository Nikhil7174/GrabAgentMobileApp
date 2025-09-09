import { useOrderToast } from '@/state/OrderToastContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OrderToast: React.FC = () => {
  const { toast, hide } = useOrderToast();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const pulse = useRef(new Animated.Value(1)).current;

  useMemo(() => {
    if (toast?.pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      ).start();
    }
  }, [toast?.pulse, pulse]);

  if (!toast) return null;

  return (
    <Pressable
      onPress={() => router.push('/track')}
      style={[
        styles.wrap,
        { bottom: Math.max(insets.bottom, 10) + 64 }, // sit just above tab bar
      ]}
      accessibilityRole="button"
      accessibilityLabel="View order status"
    >
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.topLabel}>{toast.title ?? 'Order placed'}</Text>
          <Pressable onPress={hide} hitSlop={10} accessibilityLabel="Dismiss order notification">
            <Ionicons name="close" size={16} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.midRow}>
          <Ionicons name="time-outline" size={14} color="#111827" />
          <Text style={styles.eta}>{toast.etaText}</Text>
        </View>

        <Text style={styles.rest} numberOfLines={1}>{toast.restaurant}</Text>

        {!!toast.ctaText && (
          <Animated.View style={[styles.ctaRow, toast.pulse ? { transform: [{ scale: pulse }] } : undefined]}>
            <Pressable style={styles.ctaBtn} onPress={() => router.push(toast.ctaRoute ?? '/assistant')} accessibilityRole="button">
              <Ionicons name="help-buoy" color="white" size={14} />
              <Text style={styles.ctaText}>{toast.ctaText}</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLabel: { fontWeight: '800', color: '#0F172A' },
  midRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  eta: { fontWeight: '600' },
  rest: { marginTop: 4, color: '#6B7280' },
  ctaRow: { marginTop: 10, alignItems: 'flex-start' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9999 },
  ctaText: { color: 'white', fontWeight: '800' },
});

export default OrderToast;
