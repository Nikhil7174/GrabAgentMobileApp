import { useOrderToast } from '@/state/OrderToastContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OrderToast: React.FC = () => {
  const { toast, hide } = useOrderToast();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
          <Text style={styles.topLabel}>Order placed</Text>
          <Pressable onPress={hide} hitSlop={10} accessibilityLabel="Dismiss order notification">
            <Ionicons name="close" size={16} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.midRow}>
          <Ionicons name="time-outline" size={14} color="#111827" />
          <Text style={styles.eta}>{toast.etaText}</Text>
        </View>

        <Text style={styles.rest} numberOfLines={1}>
          {toast.restaurant}
        </Text>
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
});

export default OrderToast;
