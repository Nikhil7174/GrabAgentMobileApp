import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { restaurants } from '@/constants/mock';
import { StatusBar } from 'expo-status-bar';

const menu = [
  { id: '1', title: 'Chicken Burger', price: 'RM9.90', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60&auto=format&fit=crop' },
  { id: '2', title: 'French Fries', price: 'RM6.50', image: 'https://images.unsplash.com/photo-1541599188778-cdc73298e8f8?w=800&q=60&auto=format&fit=crop' },
  { id: '3', title: 'Iced Tea', price: 'RM3.90', image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&q=60&auto=format&fit=crop' },
];

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = restaurants.find((r) => r.id === id) ?? restaurants[0];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack.Screen options={{ title: item.name }} />
      <FlatList
        data={menu}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            <Image source={{ uri: item.image }} style={styles.cover} />
            <View style={{ padding: 16 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>
                ⭐ {item.rating} ({item.reviews}) • {item.tags.join(' • ')}
              </Text>
              <Text style={styles.sub}>{item.fee} · {item.eta} · {item.distance}</Text>
            </View>
          </View>
        }
        renderItem={({ item: m }) => (
          <View style={styles.menuRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{m.title}</Text>
              <Text style={styles.menuPrice}>{m.price}</Text>
            </View>
            <Image source={{ uri: m.image }} style={styles.menuImage} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Pressable style={styles.cartBar} onPress={() => router.push('/cart')}>
        <Ionicons name="cart" size={18} color="white" />
        <Text style={styles.cartText}>View cart</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.cartText}>RM19.40</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 180,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    marginTop: 6,
    color: '#6B7280',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuPrice: {
    marginTop: 6,
    color: '#374151',
  },
  menuImage: {
    width: 86,
    height: 72,
    borderRadius: 12,
  },
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartText: {
    color: 'white',
    fontWeight: '700',
  },
});
