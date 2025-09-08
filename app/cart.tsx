import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'My Cart',
          headerRight: () => (
            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Manage cart">
              <Text style={styles.manage}>Manage</Text>
            </Pressable>
          ),
        }}
      />

      <Pressable style={[styles.row, styles.separator]} onPress={() => router.push('/order')} accessibilityRole="button" accessibilityLabel="Open order details">
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">McDonald's® - Batu Berendam DT 274</Text>
          <Text style={styles.sub}>1 item • From 20 mins • 2.9 km</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60&auto=format&fit=crop' }}
          style={styles.thumb}
          contentFit="cover"
        />
      </Pressable>

      <Pressable style={styles.row} onPress={() => router.push('/order')} accessibilityRole="button" accessibilityLabel="Open order details">
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">Restoran Iqra Nasi Kandar Briyani</Text>
          <Text style={styles.sub}>3 items • From 30 mins • 4.0 km</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop' }}
          style={styles.thumb}
          contentFit="cover"
        />
      </Pressable>

      <View style={{ flex: 1 }} />

      {/* Removed bottom CTA; rows now navigate to order details */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    marginTop: 4,
    color: '#6B7280',
  },
  manage: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 16,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  // Removed CTA styles as the button is no longer used
});
