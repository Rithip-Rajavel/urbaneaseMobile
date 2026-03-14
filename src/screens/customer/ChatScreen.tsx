import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import messageService from '../../services/messageService';
import { Message } from '../../types';

const ChatScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { conversationId, userName, providerId } = route.params || { userName: 'Unknown', providerId: null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    if (!providerId && !conversationId) return;

    setIsLoading(true);
    try {
      const data = await messageService.getConversation(providerId || conversationId);
      setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId, providerId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isSending || !user) return;

    setIsSending(true);
    try {
      await messageService.sendMessage({
        receiverId: providerId || conversationId,
        content: newMessage.trim()
      });

      // Add message to local state immediately
      const newMsg: Message = {
        id: messages.length + 1,
        content: newMessage.trim(),
        sender: user,
        receiver: {
          id: providerId || conversationId,
          username: userName,
          email: '',
          mobileNumber: '',
          role: 'SERVICE_PROVIDER' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: true,
          enabled: true,
          available: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCustomer = item.sender?.id === user?.id;

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
            {item.content}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: isCustomer ? colors.background : colors.textLight,
            marginTop: spacing.xs,
            textAlign: isCustomer ? 'right' : 'left',
          }}>
            {new Date(item.createdAt).toLocaleTimeString()}
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
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isTyping ? renderTypingIndicator : null}
          />
        )}

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
              disabled={newMessage.trim() === '' || isSending}
            >
              <Text style={{ fontSize: responsiveWidth(20), color: colors.background }}>
                {isSending ? '⏳' : '➤'}
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
