import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Item = { id: string; title: string; price: string; image: string };

const PromoCardCmp = ({ items }: { items: Item[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>GrabFood For One</Text>
          <Text style={styles.subtitle}>RM1 delivery with no minimum spend.</Text>
        </View>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="sale" size={28} color="#fff" />
        </View>
      </View>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
            <Text numberOfLines={2} style={styles.itemTitle}>
              {item.title}
            </Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

export const PromoCard = React.memo(PromoCardCmp);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFE89A',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4B5563',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#FF8B8B',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Removed badgeText in favor of icon-only circular badge
  item: {
    width: 120,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 14,
  },
  price: {
    marginTop: 4,
    fontWeight: '600',
  },
});
