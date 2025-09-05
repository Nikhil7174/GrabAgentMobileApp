import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  label: string;
  active?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
};

export const Chip: React.FC<Props> = ({ label, active, style, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        active ? styles.active : styles.inactive,
        pressed && { opacity: 0.6 },
        style,
      ]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 28,
  },
  inactive: {
    backgroundColor: '#EEF2F4',
  },
  active: {
    backgroundColor: '#103C2F',
  },
  text: {
    fontSize: 14,
    color: '#0F1B2A',
  },
  activeText: {
    color: 'white',
    fontWeight: '600',
  },
});

