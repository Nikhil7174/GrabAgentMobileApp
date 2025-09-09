import { ORDER_CLOSED_UPDATE, subscribeToOrderUpdates, type OrderUpdate } from '@/state/mockOrderStream';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
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

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  image?: string;
  chainOfThought?: ChainOfThoughtStep[];
  showThinking?: boolean;
};

type ChainOfThoughtStep = {
  id: string;
  reasoning: string;
  tool: string;
  observation?: string;
};

type FlowState =
  | 'initial'
  | 'awaiting_first_photo'
  | 'low_confidence'
  | 'awaiting_second_photo'
  | 'questionnaire_1'
  | 'questionnaire_2'
  | 'questionnaire_3'
  | 'final_verdict';

export default function OrderAssistantScreen() {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: "Hi! I'm tracking your order. It has been delivered and is currently pending your confirmation.",
    },
  ]);
  const [flowState, setFlowState] = useState<FlowState>('initial');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [completedThinking, setCompletedThinking] = useState<Set<string>>(new Set());

  const [received, setReceived] = useState<OrderUpdate[]>([]);

  const handleOrderClose = () => {
    setReceived((prev) => [...prev, ORDER_CLOSED_UPDATE]);
  };

  // Trigger order closure when final verdict message becomes visible
  useEffect(() => {
    if (flowState === 'final_verdict' && completedThinking.size > 0) {
      // Find the final verdict message
      const finalVerdictMessage = messages.find(m => 
        m.role === 'assistant' && 
        m.text.includes('CASE RESOLVED') && 
        completedThinking.has(m.id)
      );
      
      if (finalVerdictMessage) {
        // Delay to ensure user has time to read the case resolved message
        const timer = setTimeout(() => {
          handleOrderClose();
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [flowState, completedThinking, messages]);
  useEffect(() => {
    const unsub = subscribeToOrderUpdates('order-1', (u) => {
      setReceived((prev) => [...prev, u]);
    });
    return unsub;
  }, []);


  const heightAnim = useRef(new Animated.Value(1)).current;
  const animateCollapse = (toCollapsed: boolean) => {
    setCollapsed(toCollapsed);
    Animated.timing(heightAnim, {
      toValue: toCollapsed ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const generateChainOfThought = (state: FlowState, userInput?: string): ChainOfThoughtStep[] => {
    switch (state) {
      case 'initial':
        return [
          { id: '1', reasoning: 'User reported spillage issue - this is a product quality concern', tool: 'initiate_mediation_flow()' },
          { id: '2', reasoning: 'Need visual evidence to assess damage severity', tool: 'collect_evidence()' },
          { id: '3', reasoning: 'Photos are essential for spillage assessment', tool: 'collect_photos()', observation: 'Requesting first photo from user' }
        ];
      case 'awaiting_first_photo':
        return [
          { id: '1', reasoning: 'User reported spillage issue - this is a product quality concern', tool: 'initiate_mediation_flow()' },
          { id: '2', reasoning: 'Need visual evidence to assess damage severity', tool: 'collect_evidence()' },
          { id: '3', reasoning: 'Photos are essential for spillage assessment', tool: 'collect_photos()', observation: 'Requesting first photo from user' }
        ];
      case 'low_confidence':
        return [
          { id: '1', reasoning: 'Received photo but spillage area not clearly visible', tool: 'analyze_evidence()' },
          { id: '2', reasoning: 'Confidence score: 0.6 - below threshold of 0.7', tool: 'analyze_evidence()', observation: 'Need better angle for accurate assessment' },
          { id: '3', reasoning: 'Requesting additional photo from different angle', tool: 'collect_photos()' }
        ];
      case 'questionnaire_1':
        return [
          { id: '1', reasoning: 'Photos show clear spillage damage - confidence score: 0.85', tool: 'analyze_evidence()' },
          { id: '2', reasoning: 'Need additional context about product condition', tool: 'collect_evidence()' },
          { id: '3', reasoning: 'Starting questionnaire to gather more details', tool: 'collect_evidence()', observation: 'Asking about package opening experience' }
        ];
      case 'questionnaire_2':
        return [
          { id: '1', reasoning: `User response: "${userInput}" - indicates packaging issue`, tool: 'analyze_evidence()' },
          { id: '2', reasoning: 'Need to understand spillage extent', tool: 'collect_evidence()' },
          { id: '3', reasoning: 'Asking about product usability', tool: 'collect_evidence()', observation: 'Determining impact on product quality' }
        ];
      case 'questionnaire_3':
        return [
          { id: '1', reasoning: `User response: "${userInput}" - spillage affects product quality`, tool: 'analyze_evidence()' },
          { id: '2', reasoning: 'Gathering final evidence about merchant packaging', tool: 'collect_evidence()' },
          { id: '3', reasoning: 'Asking about packaging quality perception', tool: 'collect_evidence()', observation: 'Final assessment before verdict' }
        ];
      case 'final_verdict':
        return [
          { id: '1', reasoning: 'All evidence collected - spillage confirmed as major issue', tool: 'analyze_evidence()' },
          { id: '2', reasoning: 'Product significantly damaged, refund justified', tool: 'issue_instant_refund()' },
          { id: '3', reasoning: 'Logging packaging feedback for merchant improvement', tool: 'log_merchant_packaging_feedback()', observation: 'Case resolved with refund' }
        ];
      default:
        return [];
    }
  };

  const getResponseForState = (state: FlowState): string => {
    switch (state) {
      case 'initial':
        return "I'm really sorry to hear about the spillage issue with your package. That must be frustrating! To help resolve this quickly, could you please upload a photo showing the spillage damage? This will help me assess the situation better.";
      case 'low_confidence':
        return "Thanks for the photo. I can see there might be some spillage, but I need a clearer view to properly assess the damage (confidence: 60%). Could you please take another photo from a different angle that shows the spillage area more clearly?";
      case 'questionnaire_1':
        return "Perfect! I can now clearly see the spillage damage (confidence: 85%). To complete my assessment, I have a few quick questions:\n\n1. When you first opened the package, was the spillage immediately visible, or did you notice it after unpacking?";
      case 'questionnaire_2':
        return "2. How much of the product was affected by the spillage? Would you say it's more than half of the product?";
      case 'questionnaire_3':
        return "3. In your opinion, do you think this was caused by poor packaging or rough handling during delivery?";
      case 'final_verdict':
        return `**CASE RESOLVED ✅**

Based on my analysis, this is indeed a major spillage issue that warrants a full refund.

**REFUND RECEIPT**
-------------------
Order ID: #ORD-2024-5547
Issue: Major Product Spillage  
Refund Amount: $24.99
Processing Time: 2-3 business days
Reference: REF-${Date.now()}

**Merchant Feedback Logged:**
"Packaging quality requires improvement. Multiple spillage incidents detected. Recommend stronger sealing and protective wrapping for liquid/powder products."

Your refund is being processed and you should see it in your account within 2-3 business days. Is there anything else I can help you with?`;
      default:
        return "I'm here to help with your order concerns.";
    }
  };

  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to photos to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setUploadedImages(prev => [...prev, imageUri]);

      const userMsg: ChatMessage = {
        id: String(Date.now()),
        role: 'user',
        text: 'Photo uploaded',
        image: imageUri
      };
      setMessages(prev => [...prev, userMsg]);

      setTimeout(() => {
        let nextState: FlowState = flowState;
        if (flowState === 'awaiting_first_photo') {
          nextState = 'low_confidence';
        } else if (flowState === 'low_confidence') {
          nextState = 'questionnaire_1';
        } else if (flowState === 'awaiting_second_photo') {
          nextState = 'questionnaire_1';
        }

        const chainOfThought = generateChainOfThought(nextState);
        const responseText = getResponseForState(nextState);

        const assistantMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: 'assistant',
          text: responseText,
          chainOfThought,
          showThinking: true
        };

        setMessages(prev => [...prev, assistantMsg]);
        setFlowState(nextState);
      }, 800);
    }
  };

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!collapsed) animateCollapse(true);

    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let nextState: FlowState = flowState;
      let responseText = '';

      if (flowState === 'initial' && trimmed.toLowerCase().includes('spillage')) {
        nextState = 'awaiting_first_photo';
        responseText = getResponseForState('initial');
      } else if (flowState === 'questionnaire_1') {
        nextState = 'questionnaire_2';
        responseText = getResponseForState('questionnaire_2');
      } else if (flowState === 'questionnaire_2') {
        nextState = 'questionnaire_3';
        responseText = getResponseForState('questionnaire_3');
      } else if (flowState === 'questionnaire_3') {
        nextState = 'final_verdict';
        responseText = getResponseForState('final_verdict');
      } else {
        responseText = 'Based on current status, about 15–20 minutes total prep time.';
      }

      const chainOfThought = nextState !== flowState ? generateChainOfThought(nextState === 'awaiting_first_photo' ? 'initial' : nextState, trimmed) : undefined;

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: responseText,
        chainOfThought,
        showThinking: !!chainOfThought
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (nextState !== flowState) {
        setFlowState(nextState);
      }
    }, 600);
  };

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

        <View style={styles.timelineWrap} onLayout={(e) => setListH(e.nativeEvent.layout.height)}>
          <View style={styles.timelineLine} />
          {received.map((u, index) => (
            <AnimatedTimelineRow key={`${u.id}-${index}`} item={u} />
          ))}
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: 'padding' })}
        keyboardVerticalOffset={Platform.select({ ios: 110, android: 100 })}
      >
        <ScrollView
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <View key={m.id}>
              {m.role === 'assistant' && m.chainOfThought && m.showThinking && (
                <ChainOfThoughtComponent 
                  steps={m.chainOfThought} 
                  onComplete={() => setCompletedThinking(prev => new Set(prev).add(m.id))}
                  messageId={m.id}
                  flowState={flowState}
                />
              )}
              {(!m.showThinking || completedThinking.has(m.id) || m.role === 'user') && (
                <View style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={m.role === 'user' ? styles.userText : styles.assistantText}>{m.text}</Text>
                  {m.image && (
                    <Image source={{ uri: m.image }} style={styles.uploadedImage} />
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <Pressable style={styles.photoBtn} onPress={handleImageUpload} accessibilityRole="button" accessibilityLabel="Upload photo">
            <Ionicons name="camera" size={20} color="#16A34A" />
          </Pressable>

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

const SkeletonStep: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [pulseAnim]);

  return (
    <View>
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonTool, { opacity: pulseAnim }]} />
    </View>
  );
};

const ChainOfThoughtComponent: React.FC<{ steps: ChainOfThoughtStep[]; onComplete?: () => void; messageId?: string; flowState?: FlowState }> = ({ steps, onComplete, messageId, flowState }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 300, useNativeDriver: false }),
        Animated.timing(heightAnim, { toValue: 0, duration: 400, useNativeDriver: false })
      ]).start(() => {
        setIsCollapsed(true);
        onComplete?.();
        
      });
    };

    animateSteps();
  }, [steps]);

  if (isCollapsed) {
    return (
      <View style={styles.thinkingCollapsed}>
        <Ionicons name="bulb" size={14} color="#6B7280" />
        <Text style={styles.thinkingCollapsedText}>AI reasoning complete</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.thinkingContainer, { opacity: fadeAnim, height: heightAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 200] }) }]}>
      <View style={styles.thinkingHeader}>
        <View style={styles.thinkingDot} />
        <Text style={styles.thinkingTitle}>Thinking...</Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          // Only show steps up to and including the current step
          if (index > currentStep) {
            return null;
          }
          
          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepLine}>
                {index < steps.length - 1 && <View style={styles.connectorLine} />}
                <View style={[
                  styles.stepBullet,
                  { backgroundColor: '#22C55E' }
                ]} />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepReasoning}>{step.reasoning}</Text>
                <View style={styles.toolContainer}>
                  <Text style={styles.toolText}>{step.tool}</Text>
                </View>
                {step.observation && (
                  <Text style={styles.observationText}>→ {step.observation}</Text>
                )}
              </View>
            </View>
          );
        })}
        
        {/* Show skeleton for next step if there are more steps */}
        {currentStep < steps.length - 1 && (
          <View style={styles.stepRow}>
            <View style={styles.stepLine}>
              <View style={styles.connectorLine} />
              <View style={[styles.stepBullet, { backgroundColor: '#E5E7EB' }]} />
            </View>
            <View style={styles.stepContent}>
              <SkeletonStep />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

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
  photoBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  uploadedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  thinkingContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignSelf: 'flex-start',
    width: '95%',
    overflow: 'hidden',
  },
  thinkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  thinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  thinkingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  stepsContainer: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepLine: {
    alignItems: 'center',
    width: 20,
  },
  stepBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  connectorLine: {
    position: 'absolute',
    top: 8,
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepReasoning: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
  },
  toolContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  toolText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  observationText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 4,
    width: '80%',
  },
  skeletonTool: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    width: '40%',
  },
  thinkingCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  thinkingCollapsedText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});