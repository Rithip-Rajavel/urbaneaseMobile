import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockConversations = [
  { 
    id: 1, 
    name: 'John Doe', 
    service: 'Home Cleaning', 
    lastMessage: 'See you tomorrow at 10 AM!', 
    time: '2 mins ago', 
    unread: 0,
    avatar: '👤',
    bookingId: 1
  },
  { 
    id: 2, 
    name: 'Sarah Smith', 
    service: 'Plumbing', 
    lastMessage: 'The repair is complete', 
    time: '1 hour ago', 
    unread: 1,
    avatar: '👩',
    bookingId: 2
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    service: 'Cooking', 
    lastMessage: 'What ingredients do you prefer?', 
    time: '3 hours ago', 
    unread: 2,
    avatar: '👨',
    bookingId: 3
  },
  { 
    id: 4, 
    name: 'Lisa Davis', 
    service: 'Gardening', 
    lastMessage: 'Thanks for the booking!', 
    time: 'Yesterday', 
    unread: 0,
    avatar: '👩',
    bookingId: 4
  },
  { 
    id: 5, 
    name: 'Tom Wilson', 
    service: 'Electrical', 
    lastMessage: 'I can come tomorrow', 
    time: '2 days ago', 
    unread: 0,
    avatar: '👨',
    bookingId: 5
  },
];

const ProviderMessagesScreen = ({ navigation }: any) => {
  const [conversations, setConversations] = useState(mockConversations);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleConversationPress = (conversation: any) => {
    navigation.navigate('ProviderChat', { 
      conversationId: conversation.id, 
      userName: conversation.name,
      bookingId: conversation.bookingId
    });
    // Mark as read
    setConversations(prevConversations =>
      prevConversations.map(c =>
        c.id === conversation.id ? { ...c, unread: 0 } : c
      )
    );
  };

  const handleCallCustomer = (conversation: any) => {
    Alert.alert(
      'Call Customer',
      `Call ${conversation.name} at their phone number?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Calling', `Dialing ${conversation.name}...`);
          },
        },
      ]
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread, 0);

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
            {item.name}
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
