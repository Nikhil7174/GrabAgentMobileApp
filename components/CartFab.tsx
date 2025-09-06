import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  bottom?: number;
  showDot?: boolean;
  onPress?: () => void;
};

export const CartFab: React.FC<Props> = ({ bottom = 64, showDot = true, onPress }) => {
  const router = useRouter();
  const handlePress = onPress ?? (() => router.push('/cart'));

  return (
    <Pressable style={[styles.fab, { bottom }]} onPress={handlePress} accessibilityRole="button" accessibilityLabel="Open cart">
      <Ionicons name="bag-handle" size={22} color="#111827" />
      {showDot && <View style={styles.dot} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
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

export default CartFab;

