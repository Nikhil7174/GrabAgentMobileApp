import { Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      <Stack.Screen options={{ title: 'Order' }} />

      <View style={{ padding: 16, gap: 12 }}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.sub}>Address: Melaka International Airport</Text>
        <Text style={styles.sub}>Payment: **** 4242</Text>
        <View style={styles.card}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Summary</Text>
          <Text>Items: RM19.40</Text>
          <Text>Delivery: Free</Text>
          <Text style={{ fontWeight: '700', marginTop: 6 }}>Total: RM19.40</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <Pressable style={styles.placeOrder}>
        <Text style={styles.placeOrderText}>Place order (disabled - UI only)</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    color: '#6B7280',
  },
  card: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  placeOrder: {
    margin: 16,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontWeight: '800',
  },
});
