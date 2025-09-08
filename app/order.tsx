import { useOrderToast } from '@/state/OrderToastContext';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const orderItems = [
  {
    id: '1',
    title: 'Nasi Goreng Kampung',
    price: 23.6,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Roti Canai',
    price: 2.2,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop',
  },
];

const alsoOrdered = [
  { id: 'a', title: 'Nasi Goreng Pattaya', price: 11.8, image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=60&auto=format&fit=crop' },
  { id: 'b', title: 'Teh Ais', price: 3.4, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=60&auto=format&fit=crop' },
  { id: 'c', title: 'Kari kambing', price: 13.5, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=60&auto=format&fit=crop' },
];

function currency(n: number) {
  return `RM ${n.toFixed(2)}`;
}

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useOrderToast();
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 2.9;
  const total = subtotal + delivery;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
      <Stack.Screen options={{ title: 'Restoran Iqra Nasi Kandar Briyani House' }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={styles.distance}>Distance from you: 3.9 km</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          <Pressable hitSlop={8}><Text style={styles.link}>Add items</Text></Pressable>
        </View>

        {orderItems.map((it) => (
          <View key={it.id} style={styles.itemRow}>
            <Image source={{ uri: it.image }} style={styles.itemThumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{it.title}</Text>
              <Pressable hitSlop={6}><Text style={styles.edit}>Edit</Text></Pressable>
            </View>
            <Text style={styles.priceText}>{it.price.toFixed(2)}</Text>
            <View style={styles.qtyBadge}><Text style={styles.qtyText}>{it.qty}</Text></View>
          </View>
        ))}

        <View style={styles.sectionHeaderInline}>
          <Text style={styles.sectionTitle}>People also ordered</Text>
        </View>
        <FlatList
          data={alsoOrdered}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.recoCard}>
              <Image source={{ uri: item.image }} style={styles.recoImage} contentFit="cover" />
              <Pressable style={styles.addBtn} accessibilityRole="button" accessibilityLabel={`Add ${item.title}`}>
                <Text style={styles.addBtnText}>+</Text>
              </Pressable>
              <Text style={styles.recoTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.recoPrice}>{item.price}</Text>
            </View>
          )}
        />

        <View style={styles.totalsBox}>
          <View style={styles.lineBetween}><Text style={styles.gray}>Subtotal(Incl. Tax)</Text><Text>{currency(subtotal)}</Text></View>
          <View style={styles.lineBetween}><Text style={styles.gray}>Delivery fee</Text><Text>{currency(delivery)}</Text></View>
        </View>
      </ScrollView>

      <View style={[styles.totalBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{currency(total)}</Text>
        </View>
        <Pressable
          style={styles.placeOrder}
          onPress={() => {
            show({ restaurant: 'McDonald’s - Simpang Dewa Ruci', etaText: 'By 1:00 pm' });
            router.push('/track');
          }}
          accessibilityRole="button"
          accessibilityLabel="Place order and track"
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  distance: { color: '#6B7280' },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderInline: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  link: { color: '#2563EB', fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  itemThumb: { width: 56, height: 56, borderRadius: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  edit: { color: '#2563EB', marginTop: 4 },
  priceText: { color: '#374151', width: 60, textAlign: 'right' },
  qtyBadge: { marginLeft: 8, width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: '#111827', fontWeight: '600' },
  recoCard: { width: 120 },
  recoImage: { width: 120, height: 80, borderRadius: 12 },
  addBtn: { position: 'absolute', right: 8, top: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: 'white', fontSize: 18, fontWeight: '800', lineHeight: 18 },
  recoTitle: { marginTop: 6 },
  recoPrice: { color: '#374151' },
  totalsBox: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  lineBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6 },
  gray: { color: '#6B7280' },
  totalBar: { position: 'absolute', left: 0, right: 0, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, backgroundColor: 'white', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  totalLabel: { color: '#6B7280' },
  totalAmount: { fontWeight: '800', fontSize: 16 },
  placeOrder: { backgroundColor: '#22C55E', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center' },
  placeOrderText: { color: 'white', fontWeight: '800' },
});
