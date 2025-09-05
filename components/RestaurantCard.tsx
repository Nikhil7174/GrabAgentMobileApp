import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Restaurant } from '@/constants/mock';

type Props = {
  item: Restaurant;
  onPress?: () => void;
};

export const RestaurantCard: React.FC<Props> = ({ item, onPress }) => {
  const price = '• '.repeat(item.price).trim();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <Image source={{ uri: item.image }} style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.metaText}>
            {item.rating} ({item.reviews}) {price} • {item.tags.join(' • ')}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="bicycle" size={14} color="#14B8A6" />
          <Text style={styles.metaText}>
            {item.fee} · {item.eta}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#6B7280',
    fontSize: 13,
  },
});

