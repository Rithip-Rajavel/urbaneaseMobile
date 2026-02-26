import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockMessages = [
  { id: 1, text: 'Hi! I\'m interested in your cleaning service', sender: 'customer', time: '10:00 AM' },
  { id: 2, text: 'Hello! I\'d be happy to help you with cleaning. What type of cleaning do you need?', sender: 'provider', time: '10:02 AM' },
  { id: 3, text: 'I need regular home cleaning for my 2-bedroom apartment', sender: 'customer', time: '10:05 AM' },
  { id: 4, text: 'Perfect! I offer comprehensive cleaning services. My rate is $25/hour and I usually take 2-3 hours for a 2-bedroom apartment.', sender: 'provider', time: '10:07 AM' },
  { id: 5, text: 'That sounds reasonable. When are you available?', sender: 'customer', time: '10:10 AM' },
  { id: 6, text: 'I\'m available this Tuesday at 10 AM or Thursday at 2 PM. Which works better for you?', sender: 'provider', time: '10:12 AM' },
];

const ChatScreen = ({ route, navigation }: any) => {
  const { conversationId, userName, providerId } = route.params || { userName: 'Sarah Smith' };
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage.trim(),
      sender: 'customer',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate provider response
    setTimeout(() => {
      const providerResponse = {
        id: messages.length + 2,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        sender: 'provider',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, providerResponse]);
    }, 2000);
  };

  const renderMessage = ({ item }: any) => {
    const isCustomer = item.sender === 'customer';
    
    return (
      <View style={{
        flexDirection: isCustomer ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.lg,
      }}>
        <View style={{
          maxWidth: '70%',
          backgroundColor: isCustomer ? colors.primary : colors.surface,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          ...shadows.small,
        }}>
          <Text style={{
            fontSize: typography.body,
            color: isCustomer ? colors.background : colors.text,
            lineHeight: typography.body * 1.4,
          }}>
            {item.text}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: isCustomer ? colors.background : colors.textLight,
            marginTop: spacing.xs,
            textAlign: isCustomer ? 'right' : 'left',
          }}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    }}>
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        ...shadows.small,
      }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          fontStyle: 'italic',
        }}>
          {userName} is typing...
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: responsiveWidth(24), color: colors.primary, marginRight: spacing.md }}>
                ←
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
              }}>
                {userName}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Online
              </Text>
            </View>
            <TouchableOpacity style={{ padding: spacing.sm }}>
              <Text style={{ fontSize: responsiveWidth(20) }}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginRight: spacing.sm }}>
              <Text style={{ fontSize: responsiveWidth(24) }}>📎</Text>
            </TouchableOpacity>
            
            <View style={{
              flex: 1,
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              marginRight: spacing.sm,
            }}>
              <TextInput
                style={{
                  fontSize: typography.body,
                  color: colors.text,
                  flex: 1,
                }}
                placeholder="Type a message..."
                placeholderTextColor={colors.textLight}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
              />
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                width: responsiveWidth(40),
                height: responsiveWidth(40),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleSendMessage}
              disabled={newMessage.trim() === ''}
            >
              <Text style={{ fontSize: responsiveWidth(20), color: colors.background }}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const shadows = {
  small: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
};

export default ChatScreen;
