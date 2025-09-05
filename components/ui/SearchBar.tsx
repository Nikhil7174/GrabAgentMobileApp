import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  placeholder?: string;
  onPress?: () => void;
};

export const SearchBar: React.FC<Props> = ({ placeholder = 'What shall we deliver?', onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && { opacity: 0.6 }]}>
      <Ionicons name="search" size={18} color="#667085" />
      <Text style={styles.placeholder}>{placeholder}</Text>
      <View style={{ flex: 1 }} />
      <Ionicons name="mic-outline" size={18} color="#98A2B3" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  placeholder: {
    color: '#667085',
    fontSize: 16,
  },
});

