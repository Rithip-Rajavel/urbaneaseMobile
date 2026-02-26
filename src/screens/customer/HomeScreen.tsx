import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockCategories = [
  { id: 1, name: 'Cleaning', icon: '🧹', description: 'Professional cleaning services' },
  { id: 2, name: 'Plumbing', icon: '🔧', description: 'Expert plumbing solutions' },
  { id: 3, name: 'Cooking', icon: '👨‍🍳', description: 'Home cooking and meal prep' },
  { id: 4, name: 'Electrical', icon: '⚡', description: 'Electrical repairs and installation' },
  { id: 5, name: 'Gardening', icon: '🌱', description: 'Garden maintenance and landscaping' },
  { id: 6, name: 'Painting', icon: '🎨', description: 'Interior and exterior painting' },
];

const mockProviders = [
  { id: 1, name: 'John Smith', service: 'Cleaning', rating: 4.8, reviews: 127, price: '$25/hr', verified: true },
  { id: 2, name: 'Sarah Johnson', service: 'Cooking', rating: 4.9, reviews: 89, price: '$30/hr', verified: true },
  { id: 3, name: 'Mike Wilson', service: 'Plumbing', rating: 4.7, reviews: 203, price: '$45/hr', verified: true },
];

const HomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ServiceProviders', { categoryId: category.id, categoryName: category.name });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleBookingsPress = () => {
    navigation.navigate('Bookings');
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginRight: spacing.md,
        width: responsiveWidth(100),
        ...shadows.small,
      }}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(50),
        height: responsiveWidth(50),
        borderRadius: responsiveWidth(25),
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
      }}>
        <Text style={{ fontSize: responsiveWidth(24) }}>{item.icon}</Text>
      </View>
      <Text style={{
        fontSize: typography.caption,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
      }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProviderItem = ({ item }: any) => (
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
      onPress={() => navigation.navigate('ServiceProviders', { providerId: item.id })}
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
        <Text style={{ fontSize: responsiveWidth(20) }}>👤</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginRight: spacing.sm,
          }}>
            {item.name}
          </Text>
          {item.verified && (
            <Text style={{ fontSize: responsiveWidth(16) }}>✓</Text>
          )}
        </View>
        
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.service} • {item.price}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
            ⭐
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.text,
            fontWeight: '500',
          }}>
            {item.rating}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
            marginLeft: spacing.xs,
          }}>
            ({item.reviews} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Welcome back,
              </Text>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
              }}>
                {user?.username || 'Guest'}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleBookingsPress}
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
              }}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                My Bookings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.sm, color: colors.textLight }}>
              🔍
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.textLight,
            }}>
              Search for services...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              fontSize: typography.h4,
              fontWeight: 'bold',
              color: colors.text,
            }}>
              Categories
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={{
                fontSize: typography.body,
                color: colors.primary,
                fontWeight: '500',
              }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: spacing.lg, paddingRight: spacing.lg }}
          />
        </View>

        {/* Top Providers */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          }}>
            <Text style={{
              fontSize: typography.h4,
              fontWeight: 'bold',
              color: colors.text,
            }}>
              Top Providers
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceProviders')}>
              <Text style={{
                fontSize: typography.body,
                color: colors.primary,
                fontWeight: '500',
              }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ paddingHorizontal: spacing.lg }}>
            {mockProviders.map((provider) => (
              <View key={provider.id}>
                {renderProviderItem({ item: provider })}
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Quick Actions
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: 'center',
                width: responsiveWidth(100),
              }}
              onPress={() => navigation.navigate('Bookings')}
            >
              <Text style={{ fontSize: responsiveWidth(24), marginBottom: spacing.sm }}>📅</Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                textAlign: 'center',
              }}>
                My Bookings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: 'center',
                width: responsiveWidth(100),
              }}
              onPress={() => navigation.navigate('Messages')}
            >
              <Text style={{ fontSize: responsiveWidth(24), marginBottom: spacing.sm }}>💬</Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                textAlign: 'center',
              }}>
                Messages
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: 'center',
                width: responsiveWidth(100),
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={{ fontSize: responsiveWidth(24), marginBottom: spacing.sm }}>👤</Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                textAlign: 'center',
              }}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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

export default HomeScreen;
