import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackOrderScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Track Order',
          headerRight: () => (
            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Get help">
              <Text style={styles.help}>Get help</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.pill}><Text style={styles.pillText}>Priority Delivery</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.timeRange}>12:50 - 1:00 PM</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={styles.dotGreen} />
                <Text style={styles.onTime}>On time • We’ve got your order!</Text>
              </View>
            </View>
            <View style={styles.illoCircle}>
              <Ionicons name="phone-portrait" size={22} color="#0F766E" />
            </View>
          </View>
          <View style={styles.progressRow}>
            <Ionicons name="restaurant" size={18} color="#9CA3AF" />
            <View style={styles.progressLine} />
            <Ionicons name="bicycle" size={18} color="#9CA3AF" />
            <View style={styles.progressLine} />
            <Ionicons name="home" size={18} color="#9CA3AF" />
          </View>
          <Text style={styles.note}>If the delivery arrives after 03:16 PM, you’ll get a GrabFood delivery voucher.</Text>
        </View>

        {/* Restaurant card */}
        <View style={styles.cardWhite}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=60&auto=format&fit=crop' }} style={styles.avatar} />
            <Text style={{ fontWeight: '700' }}>McDonald’s - Simpang Dewa Ruci</Text>
          </View>
          <View style={styles.tipBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Ionicons name="heart-outline" size={18} color="#0F766E" />
              <Text style={styles.tipText}>Save this restaurant to Favourites and find it quickly next time.</Text>
            </View>
            <Ionicons name="heart-outline" size={20} color="#0F766E" />
          </View>
        </View>

        {/* Payment + Offers */}
        <View style={styles.cardWhite}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}><Ionicons name="cash" size={18} color="#111827" /><Text style={styles.rowTitle}>Cash</Text></View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}><Ionicons name="pricetags-outline" size={18} color="#111827" /><Text style={styles.rowTitle}>Offers</Text></View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </View>

        {/* Totals */}
        <View style={styles.cardWhite}>
          <View style={styles.lineBetween}><Text style={{ fontWeight: '700' }}>Total</Text><Text style={{ fontWeight: '800' }}>RM195.50</Text></View>
          <Text style={styles.savings}>Yay, you’ve saved RM19.00 🎉  <Text style={styles.strike}>RM214.50</Text></Text>
        </View>
      </ScrollView>

      <View style={{ flex: 1 }} />
      <Pressable style={styles.doneBtn} onPress={() => router.replace('/')} accessibilityRole="button" accessibilityLabel="Done tracking order">
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  help: { color: '#2563EB', fontWeight: '600' },
  header: {
    fontSize: 20,
    fontWeight: '800',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  rowText: {
    color: '#111827',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  pill: { alignSelf: 'flex-start', backgroundColor: '#E6F4EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pillText: { color: '#0F766E', fontWeight: '700', fontSize: 12 },
  timeRange: { fontSize: 18, fontWeight: '800' },
  onTime: { color: '#065F46' },
  illoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6F4EE', alignItems: 'center', justifyContent: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  progressLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', borderRadius: 1 },
  note: { color: '#374151', marginTop: 12 },
  cardWhite: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  tipBox: { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tipText: { color: '#065F46', flex: 1, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowTitle: { fontWeight: '600' },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  item: {
    fontWeight: '700',
  },
  sub: {
    color: '#6B7280',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  lineBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  total: {
    fontWeight: '800',
  },
  doneBtn: {
    margin: 16,
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneText: {
    color: 'white',
    fontWeight: '800',
  },
  savings: { color: '#16A34A', marginTop: 6 },
  strike: { color: '#9CA3AF', textDecorationLine: 'line-through' },
});
