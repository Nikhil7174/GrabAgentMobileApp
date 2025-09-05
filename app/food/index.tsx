import { PromoCard } from '@/components/PromoCard';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { restaurants, yellowPromoItems } from '@/constants/mock';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FoodHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#000000');
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  const Header = (
    <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]}> 
      <View style={styles.headerTopRow}>
        <Pressable hitSlop={16}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable hitSlop={16}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </Pressable>
        <Pressable hitSlop={16} style={{ marginLeft: 12 }} onPress={() => router.push('/cart')}>
          <Ionicons name="bag-outline" size={24} color="white" />
        </Pressable>
      </View>
      <Text style={styles.deliverTo}>DELIVER TO</Text>
      <Pressable style={styles.locationRow}>
        <Text numberOfLines={1} style={styles.locationText}>
          Melaka International Airport
        </Text>
        <Ionicons name="chevron-down" size={18} color="white" />
      </Pressable>
      <View style={{ marginTop: 12 }}>
        <SearchBar onPress={() => {}} />
      </View>
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Restoran 5-Bintang</Text>
          <Text style={styles.bannerSubtitle}>Makanan tempatan terbaik, mesti cuba ni!</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={22} color="#0F5132" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* <StatusBar style="light" backgroundColor="#27AE60" /> */}
      <FlatList
        data={restaurants}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View>
            {Header}
            <View style={styles.chipsRow}>
              <Chip label="Delivery" active />
              <Chip label="Dine Out: 40% Off" />
              <Chip label="Pickup" />
            </View>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <PromoCard items={yellowPromoItems} />
            </View>
            <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <RestaurantCard item={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: '#F3F4F6', marginHorizontal: 16 }} />} 
        ListEmptyComponent={null}
        ListFooterComponent={<View style={{ height: 8 }} />}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/cart')}>
        <Ionicons name="bag-handle" size={22} color="#111827" />
        <View style={styles.dot} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: '#27AE60',
    padding: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliverTo: {
    color: 'white',
    opacity: 0.85,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  banner: {
    marginTop: 16,
    backgroundColor: '#CFF6DD',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F5132',
  },
  bannerSubtitle: {
    marginTop: 6,
    color: '#0F5132',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  dot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
