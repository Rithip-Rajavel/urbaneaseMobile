import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import messageService from '../../services/messageService';
import bookingService from '../../services/bookingService';
import { Message, Booking } from '../../types';

interface Conversation {
  id: number;
  userName: string;
  service: string;
  lastMessage: string;
  time: string;
  unread: number;
  bookingId: number;
  phoneNumber?: string;
  avatar: string;
}

const ProviderMessagesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Load bookings to get conversations
      const bookingsResponse = await bookingService.getMyBookings();
      
      // Load unread messages
      let unreadMessages: Message[] = [];
      try {
        unreadMessages = await messageService.getUnreadMessages();
      } catch (error) {
        console.error('Error loading unread messages:', error);
      }
      
      // Create conversations from bookings
      const conversationsData: Conversation[] = bookingsResponse.map(booking => {
        const bookingMessages = unreadMessages.filter(msg => msg.booking?.id === booking.id);
        const unreadCount = bookingMessages.filter(msg => !msg.read).length;
        
        return {
          id: booking.id,
          userName: booking.customer.username,
          service: booking.service.name,
          lastMessage: bookingMessages.length > 0 
            ? bookingMessages[bookingMessages.length - 1].content 
            : 'No messages yet',
          time: bookingMessages.length > 0 
            ? formatMessageTime(bookingMessages[bookingMessages.length - 1].createdAt)
            : formatMessageTime(booking.createdAt),
          unread: unreadCount,
          bookingId: booking.id,
          phoneNumber: booking.customer.mobileNumber,
          avatar: '👤',
        };
      });
      
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.abs(now.getHours() - date.getHours());
      if (diffHours === 0) {
        const diffMins = Math.abs(now.getMinutes() - date.getMinutes());
        return diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleConversationPress = async (conversation: Conversation) => {
    navigation.navigate('ProviderChat', { 
      conversationId: conversation.id, 
      userName: conversation.userName,
      bookingId: conversation.bookingId
    });
    
    // Mark messages as read
    try {
      await messageService.markMessagesAsRead(conversation.id);
      setConversations(prevConversations =>
        prevConversations.map(c =>
          c.id === conversation.id ? { ...c, unread: 0 } : c
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleCallCustomer = (conversation: Conversation) => {
    Alert.alert(
      'Call Customer',
      `Call ${conversation.userName} at their phone number?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Calling', `Dialing ${conversation.userName}...`);
          },
        },
      ]
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small,
      }}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(50),
        height: responsiveWidth(50),
        borderRadius: borderRadius.md,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(24) }}>{item.avatar}</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
          }}>
            {item.userName}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {item.time}
          </Text>
        </View>
        
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.service}
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
            flex: 1,
            marginRight: spacing.sm,
          }}
          numberOfLines={1}>
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: responsiveWidth(10),
              minWidth: responsiveWidth(20),
              height: responsiveWidth(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={{
        marginRight: spacing.md,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.sm,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.sm,
          }}
          onPress={() => handleCallCustomer(item)}
        >
          <Text style={{ fontSize: responsiveWidth(20), color: colors.background }}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading conversations...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.h4,
              fontWeight: 'bold',
              color: colors.text,
            }}>
              Messages
            </Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: colors.primary,
                borderRadius: responsiveWidth(12),
                paddingHorizontal: spacing.sm,
                paddingVertical: 2,
              }}>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '600',
                }}>
                  {unreadCount} unread
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.sm, color: colors.textLight }}>
              🔍
            </Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: typography.body,
                color: colors.text,
              }}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>💬</Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </Text>
              {!searchQuery && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.textLight,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                }}>
                  Start accepting bookings to chat with customers
                </Text>
              )}
            </View>
          }
        />

        {/* Stats Footer */}
        <View style={{
          backgroundColor: colors.surface,
          padding: spacing.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            {conversations.length} conversations • 
            {unreadCount} unread messages
          </Text>
        </View>
      </View>
      )}
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

export default ProviderMessagesScreen;
