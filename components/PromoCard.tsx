import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Image } from 'expo-image';

type Item = { id: string; title: string; price: string; image: string };

export const PromoCard = ({ items }: { items: Item[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>GrabFood For One</Text>
          <Text style={styles.subtitle}>RM1 delivery with no minimum spend.</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>No min. spend</Text>
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
            <Image source={{ uri: item.image }} style={styles.image} />
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
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

