import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      <Stack.Screen options={{ title: 'My Cart' }} />
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60&auto=format&fit=crop' }}
          style={styles.thumb}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>McDonald's® - Batu Berendam DT 274</Text>
          <Text style={styles.sub}>1 item • From 20 mins • 2.9 km</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1604908554049-9109f1d2ac69?w=800&q=60&auto=format&fit=crop' }}
          style={styles.thumb}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Restoran Iqra Nasi Kandar Briyani</Text>
          <Text style={styles.sub}>3 items • From 30 mins • 4.0 km</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Pressable style={styles.cta} onPress={() => router.push('/order')}>
        <Text style={styles.ctaText}>Go to order</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
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
    marginTop: 6,
    color: '#6B7280',
  },
  cta: {
    margin: 16,
    backgroundColor: '#27AE60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
});
