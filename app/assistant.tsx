import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { subscribeToOrderUpdates, type OrderUpdate } from '@/state/mockOrderStream';

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

  // Received updates from the mock backend stream
  const [received, setReceived] = useState<OrderUpdate[]>([]);
  useEffect(() => {
    const unsub = subscribeToOrderUpdates('order-1', (u) => {
      setReceived((prev) => [...prev, u]);
    });
    return unsub;
  }, []);

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

  // Animate to a sensible max height for 5 vertical items
  // Measure content so the collapse expands to the right size
  const [headerH, setHeaderH] = useState(0);
  const [listH, setListH] = useState(0);
  const updatesHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(1, headerH + listH)] });
  const updatesOpacity = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const latestActive = received[received.length - 1] ?? {
    id: 'pending',
    title: 'Waiting for updates',
    subtitle: 'Tracking your order…',
    color: '#22C55E',
    bg: '#E9F8EF',
  };

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
        <View style={styles.updatesHeader} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Order Assistant</Text>
            <Text style={styles.headerSub}>Tracking your order</Text>
          </View>
          <Pressable hitSlop={8} onPress={() => animateCollapse(true)} accessibilityRole="button" accessibilityLabel="Collapse live updates">
            <Ionicons name="chevron-up" size={18} color="#065F46" />
          </Pressable>
        </View>

        {/* Vertical timeline list */}
        <View style={styles.timelineWrap} onLayout={(e) => setListH(e.nativeEvent.layout.height)}>
          <View style={styles.timelineLine} />
          {received.map((u) => (
            <AnimatedTimelineRow key={u.id} item={u} />
          ))}
        </View>
      </Animated.View>

      {/* Chat area with KeyboardAvoidingView */}
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: 'padding' })}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 80 })}
      >
        <ScrollView 
          contentContainerStyle={styles.chatList} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={m.role === 'user' ? styles.userText : styles.assistantText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Input bar */}
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
  // Timeline styles
  timelineWrap: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 4,
    marginBottom: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 24,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
    paddingLeft: 12,
  },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginLeft: 12, marginTop: 16 },
  timelineCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
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

// Animated row for timeline items
const AnimatedTimelineRow: React.FC<{ item: OrderUpdate }> = ({ item }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const transY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(transY, { toValue: 0, damping: 18, stiffness: 160, mass: 0.6, useNativeDriver: true }),
    ]).start();
  }, [opacity, transY]);

  return (
    <Animated.View style={[styles.timelineRow, { opacity, transform: [{ translateY: transY }] }]}> 
      <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
      <View style={[styles.timelineCard, { backgroundColor: item.bg }]}> 
        <Text style={[styles.updateTitle, { color: item.color }]}>{item.title}</Text>
        {!!item.subtitle && <Text style={styles.updateSub}>{item.subtitle}</Text>}
      </View>
    </Animated.View>
  );
};
