import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import messageService from '../../services/messageService';
import { Message } from '../../types';

// Extended interface for conversations
interface Conversation extends Message {
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const MessagesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getUnreadMessages();
      // Group messages by sender to create conversations
      const conversationsMap = new Map();

      data.forEach((message: Message) => {
        const senderId = message.sender?.id;
        if (senderId && message.sender) {
          if (!conversationsMap.has(senderId)) {
            conversationsMap.set(senderId, {
              ...message,
              unreadCount: 0,
              lastMessage: message.content,
              lastMessageTime: message.createdAt
            });
          }

          const conversation = conversationsMap.get(senderId);
          if (!message.read) {
            conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          }

          // Update last message if this one is more recent
          if (new Date(message.createdAt) > new Date(conversation.lastMessageTime)) {
            conversation.lastMessage = message.content;
            conversation.lastMessageTime = message.createdAt;
          }
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleConversationPress = (conversation: any) => {
    navigation.navigate('Chat', {
      conversationId: conversation.id,
      userName: conversation.sender?.username || 'Unknown',
      providerId: conversation.sender?.id
    });
    // Mark messages as read
    if (conversation.sender?.id) {
      messageService.markMessagesAsRead(conversation.sender.id).catch(console.error);
    }
  };

  const handleMarkAsRead = (conversation: any) => {
    if (conversation.sender?.id) {
      messageService.markMessagesAsRead(conversation.sender.id).catch(console.error);
      // Update local state
      setConversations(prevConversations =>
        prevConversations.map(c =>
          c.sender?.id === conversation.sender?.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.sender?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: any) => (
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
        borderRadius: responsiveWidth(25),
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(24) }}>👤</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
          }}>
            {item.sender?.username || 'Unknown'}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.booking?.service?.name || 'Service'}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
            flex: 1,
            marginRight: spacing.sm,
          }}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unreadCount > 0 && (
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
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.h2,
              fontWeight: 'bold',
              color: colors.text,
            }}>
              Messages
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
            }}>
              {conversations.length} conversations
            </Text>
          </View>

          {/* Search Bar */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.sm,
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
                No conversations found
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView >
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

export default MessagesScreen;
