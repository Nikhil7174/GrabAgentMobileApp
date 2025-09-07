import React, { useMemo, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type UpdateItem = {
  id: string;
  title: string;
  subtitle?: string;
  color: string; // dot color
  bg: string; // background color for pill/card
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

export default function OrderAssistantScreen() {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: "Hi! I'm tracking your order. It's currently being prepared.",
    },
  ]);

  const updates: UpdateItem[] = useMemo(
    () => [
      {
        id: 'u1',
        title: 'Order Received',
        subtitle: 'Pizza Palace · 2:15 PM',
        color: '#22C55E',
        bg: '#E9F8EF',
      },
      {
        id: 'u2',
        title: 'Preparing Order',
        subtitle: 'Est. 15–20 minutes',
        color: '#F59E0B',
        bg: '#FEF3C7',
      },
      {
        id: 'u3',
        title: 'Driver Assigned',
        subtitle: 'John · Honda Civic · ABC123',
        color: '#3B82F6',
        bg: '#DBEAFE',
      },
      {
        id: 'u4',
        title: 'Out for Delivery',
        subtitle: '5 minutes away',
        color: '#A855F7',
        bg: '#F3E8FF',
      },
      {
        id: 'u5',
        title: 'Delivered',
        subtitle: 'Pending…',
        color: '#D1D5DB',
        bg: '#F3F4F6',
      },
    ],
    []
  );

  // Collapsible panel animation
  const heightAnim = useRef(new Animated.Value(1)).current; // 1 expanded, 0 collapsed
  const animateCollapse = (toCollapsed: boolean) => {
    setCollapsed(toCollapsed);
    Animated.timing(heightAnim, {
      toValue: toCollapsed ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!collapsed) animateCollapse(true);
    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Mock assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          text: 'Based on current status, about 15–20 minutes total prep time.',
        },
      ]);
    }, 600);
  };

  const updatesHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });
  const updatesOpacity = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const latestActive = updates[3]; // e.g., Out for Delivery

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: 'AI Order Assistant' }} />

      {/* Collapsed summary bar */}
      {collapsed && (
        <Pressable style={styles.summaryBar} onPress={() => animateCollapse(false)} accessibilityRole="button" accessibilityLabel="Expand live updates">
          <View style={styles.rowLeft}>
            <View style={[styles.dot, { backgroundColor: latestActive.color }]} />
            <Text style={styles.summaryText}>
              {latestActive.title} • {latestActive.subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#065F46" />
        </Pressable>
      )}

      {/* Live updates panel */}
      <Animated.View style={[styles.updatesPanel, { height: updatesHeight, opacity: updatesOpacity, overflow: 'hidden' }]}>        
        <View style={styles.updatesHeader}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Order Assistant</Text>
            <Text style={styles.headerSub}>Tracking your order</Text>
          </View>
          <Pressable hitSlop={8} onPress={() => animateCollapse(true)} accessibilityRole="button" accessibilityLabel="Collapse live updates">
            <Ionicons name="chevron-up" size={18} color="#065F46" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}>
          {updates.map((u, idx) => (
            <View key={u.id} style={[styles.updateCard, { backgroundColor: u.bg, opacity: idx === updates.length - 1 ? 0.5 : 1 }]}>              
              <View style={styles.updateHeader}>
                <View style={[styles.dot, { backgroundColor: u.color }]} />
                <Text style={styles.updateTitle}>{u.title}</Text>
              </View>
              {!!u.subtitle && <Text style={styles.updateSub}>{u.subtitle}</Text>}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Chat area */}
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={false}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={m.role === 'user' ? styles.userText : styles.assistantText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            value={input}
            onFocus={() => !collapsed && animateCollapse(true)}
            onChangeText={setInput}
            onSubmitEditing={onSend}
            returnKeyType="send"
          />
          <Pressable style={styles.sendBtn} onPress={onSend} accessibilityRole="button" accessibilityLabel="Send message">
            <Ionicons name="arrow-forward" size={18} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  flex: { flex: 1 },
  updatesPanel: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    paddingTop: 8,
    marginBottom: 8,
  },
  updatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontWeight: '800', color: '#111827' },
  headerSub: { color: '#065F46', fontSize: 12 },
  updateCard: {
    padding: 12,
    borderRadius: 12,
    minWidth: 220,
  },
  updateHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  updateTitle: { fontWeight: '700', color: '#111827' },
  updateSub: { color: '#374151' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  summaryBar: {
    backgroundColor: '#E6F4EE',
    borderColor: '#D1FAE5',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: { color: '#065F46', fontWeight: '600', flexShrink: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  chatList: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#E5F0FF' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#22C55E' },
  assistantText: { color: '#111827' },
  userText: { color: 'white', fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

