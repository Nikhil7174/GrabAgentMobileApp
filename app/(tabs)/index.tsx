import CartFab from '@/components/CartFab';
import OrderToast from '@/components/OrderToast';
import { SearchBar } from '@/components/ui/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Image as RNImage, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type IoniconName = keyof typeof Ionicons.glyphMap;
const services: { id: string; icon: IoniconName; label: string }[] = [
  { id: 'car', icon: 'car-outline', label: 'Car' },
  { id: 'food', icon: 'fast-food-outline', label: 'Food' },
  { id: 'mart', icon: 'bag-outline', label: 'Mart' },
  { id: 'grocery', icon: 'cart-outline', label: 'Grocery' },
  { id: 'express', icon: 'cube-outline', label: 'Express' },
  { id: 'dine', icon: 'restaurant-outline', label: 'Dine Out' },
  { id: 'banking', icon: 'card-outline', label: 'Banking' },
  { id: 'all', icon: 'apps-outline', label: 'All' },
];

export default function GrabHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={[0]}
        keyExtractor={(i, idx) => String(idx)}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
              <View style={styles.headerRow}>
                <Pressable style={styles.scanBtn}>
                  <Ionicons name="scan-outline" size={20} color="#0F5132" />
                </Pressable>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <SearchBar placeholder="Search the Grab app" />
                </View>
                <Pressable style={styles.avatar}>
                  <Ionicons name="person-outline" size={20} color="#0F5132" />
                </Pressable>
              </View>

              <View style={styles.grid}>
                {services.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.tile}
                    onPress={() => s.id === 'food' && router.push('/food')}
                  >
                    <Ionicons name={s.icon} size={20} color="#0F5132" />
                    <Text style={styles.tileText}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <View style={styles.infoContent}>
                  <View>
                    <Text style={styles.infoTitle}>Activate</Text>
                    <View style={styles.valueRow}>
                      <Text style={styles.infoValue}>GrabPay</Text>
                      <View style={styles.infoIcon}>
                        <Ionicons name="wallet" size={20} color="#00B14F" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoContent}>
                  <View>
                    <Text style={styles.infoTitle}>Points</Text>
                    <View style={styles.valueRow}>
                      <Text style={styles.infoValue}>50</Text>
                      <View style={styles.infoIcon}>
                        <Ionicons name="pricetags" size={20} color="#00B14F" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Book now</Text>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </View>
            <RNImage
              source={{ uri: 'https://assets.grab.com/wp-content/uploads/sites/8/2021/06/21202207/In-App-Inbox-750x365.jpg' }}
              style={styles.bannerImg}
            />
            <Text style={styles.bannerCaption}>Limited-time ride & food deals</Text>

          </View>
        }
      />
      <View style={{marginBottom: -80}}>
        <CartFab />
      </View>
      <OrderToast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4cc8b7',
    padding: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 14,
  },
  avatar: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  grid: {
    marginTop: 28,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  tile: {
    width: '20%',
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  tileText: {
    marginTop: 8,
    fontSize: 12,
    color: '#0F5132',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    backgroundColor: 'white',
  },
  infoContent: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  infoIcon: {
    backgroundColor: '#ECFDF5',
    padding: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  infoTitle: { 
    color: '#6B7280',
    fontSize: 13,
  },
  infoValue: { 
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  bannerImg: {
    height: 170,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  bannerCaption: {
    paddingHorizontal: 16,
    marginTop: 10,
    color: '#111827',
  },
});
