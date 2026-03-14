import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import messageService from '../../services/messageService';
import { Message } from '../../types';

const ProviderChatScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { conversationId, userName, bookingId } = route.params || { userName: 'John Doe' };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User not found');
      }
      
      // Load conversation messages
      const messagesResponse = await messageService.getConversation(conversationId);
      setMessages(messagesResponse);
      
      // Mark messages as read
      await messageService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId, user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user?.id) return;

    try {
      setSendingMessage(true);
      
      // Send message via API
      const messageRequest = {
        receiverId: conversationId, // This would need to be the actual customer ID
        content: newMessage.trim(),
        bookingId: bookingId,
      };
      
      const sentMessage = await messageService.sendMessage(messageRequest);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCallCustomer = () => {
    Alert.alert(
      'Call Customer',
      `Call ${userName} at their phone number?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Calling', `Dialing ${userName}...`);
          },
        },
      ]
    );
  };

  const handleViewBooking = () => {
    if (bookingId) {
      navigation.navigate('ProviderBookingDetails', { bookingId });
    } else {
      Alert.alert('No Booking', 'No booking associated with this conversation.');
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isProvider = item.sender.id === user?.id;
    
    return (
      <View style={{
        flexDirection: isProvider ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.lg,
      }}>
        <View style={{
          maxWidth: '70%',
          backgroundColor: isProvider ? colors.primary : colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginLeft: isProvider ? spacing.md : 0,
          marginRight: isProvider ? 0 : spacing.md,
          ...shadows.small,
        }}>
          <Text style={{
            fontSize: typography.body,
            color: isProvider ? colors.background : colors.text,
            lineHeight: typography.body * 1.4,
          }}>
            {item.content}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: isProvider ? colors.background : colors.textLight,
            marginTop: spacing.xs,
            textAlign: isProvider ? 'right' : 'left',
          }}>
            {formatMessageTime(item.createdAt)}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ fontSize: responsiveWidth(24), color: colors.primary, marginRight: spacing.md }}>
                  ←
                </Text>
              </TouchableOpacity>
              <View>
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
                  Customer
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                style={{ padding: spacing.sm, marginRight: spacing.sm }}
                onPress={handleViewBooking}
              >
                <Text style={{ fontSize: responsiveWidth(20) }}>📅</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ padding: spacing.sm }}
                onPress={handleCallCustomer}
              >
                <Text style={{ fontSize: responsiveWidth(20) }}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Messages List */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading messages...</Text>
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
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>💬</Text>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
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
                opacity: sendingMessage ? 0.5 : 1,
              }}
              onPress={handleSendMessage}
              disabled={newMessage.trim() === '' || sendingMessage}
            >
              {sendingMessage ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={{ fontSize: responsiveWidth(20), color: colors.background }}>
                  ➤
                </Text>
              )}
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

export default ProviderChatScreen;
