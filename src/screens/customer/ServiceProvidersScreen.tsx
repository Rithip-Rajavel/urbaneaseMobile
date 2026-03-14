import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import serviceService from '../../services/serviceService';
import { ProviderProfile } from '../../types';

const ServiceProvidersScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { categoryId, categoryName } = route.params || { categoryId: null, categoryName: 'All Providers' };
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filterVerified, setFilterVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      let providersData;
      if (categoryId) {
        // If categoryId is provided, we need to filter by category
        const allProviders = await serviceService.getNearbyProviders(
          user?.currentLocation?.latitude || 37.78825,
          user?.currentLocation?.longitude || -122.4324,
          50 // Larger radius to get more providers
        );
        providersData = allProviders.filter(provider =>
          provider.user?.active && true // Basic filter since we don't have services property
        );
      } else {
        providersData = await serviceService.getNearbyProviders(
          user?.currentLocation?.latitude || 37.78825,
          user?.currentLocation?.longitude || -122.4324,
          50
        );
      }

      // Apply filters
      let filteredProviders = providersData;
      if (filterVerified) {
        filteredProviders = filteredProviders.filter(p => p.verificationStatus === 'VERIFIED');
      }

      // Apply sorting
      filteredProviders.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'experience':
            return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
          case 'price':
            return 0; // Remove price sorting since we don't have direct access to service prices
          default:
            return 0;
        }
      });

      setProviders(filteredProviders);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      Alert.alert('Error', 'Failed to load providers. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [categoryId, filterVerified, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProviders();
  };

  const handleProviderPress = (provider: any) => {
    navigation.navigate('BookingDetails', { providerId: provider.id });
  };

  const handleBookNow = (provider: ProviderProfile) => {
    Alert.alert(
      'Book Service',
      `Book ${provider.firstName} ${provider.lastName} for services?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: () => {
            navigation.navigate('BookingDetails', { providerId: provider.id });
          },
        },
      ]
    );
  };

  const handleChat = (provider: ProviderProfile) => {
    navigation.navigate('Chat', {
      providerId: provider.id,
      userName: `${provider.firstName} ${provider.lastName}`
    });
  };

  const handleSort = (type: string) => {
    setSortBy(type);
  };

  const filteredProviders = filterVerified
    ? providers.filter(p => p.verificationStatus === 'VERIFIED')
    : providers;

  const renderProviderItem = ({ item }: { item: ProviderProfile }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows.small,
    }}>
      <TouchableOpacity
        onPress={() => handleProviderPress(item)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm }}>
          <View style={{
            width: responsiveWidth(60),
            height: responsiveWidth(60),
            borderRadius: borderRadius.md,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.md,
          }}>
            {item.profileImageUrl ? (
              <Text style={{ fontSize: responsiveWidth(30) }}>👤</Text>
            ) : (
              <Text style={{ fontSize: responsiveWidth(30) }}>👤</Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginRight: spacing.sm,
              }}>
                {item.firstName} {item.lastName}
              </Text>
              {item.verificationStatus === 'VERIFIED' && (
                <Text style={{ fontSize: responsiveWidth(14), color: colors.success }}>✓</Text>
              )}
            </View>

            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              {item.yearsOfExperience} years experience • {item.completedJobs || 0} jobs completed
            </Text>

            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginBottom: spacing.sm,
              lineHeight: typography.caption * 1.3,
            }}>
              {item.bio || 'Professional service provider'}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
                ⭐
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                fontWeight: '500',
                marginRight: spacing.sm,
              }}>
                {item.averageRating || 'N/A'}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textLight,
                marginRight: spacing.sm,
              }}>
                ({item.totalReviews || 0} reviews)
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textLight,
              }}>
                • Available
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            Contact for pricing
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.xs,
          }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.success,
              marginRight: spacing.xs,
            }} />
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              Available
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              marginRight: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={() => handleChat(item)}
          >
            <Text style={{ fontSize: responsiveWidth(16) }}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            }}
            onPress={() => handleBookNow(item)}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const SortButton = ({ type, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: sortBy === type ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: sortBy === type ? colors.primary : colors.border,
      }}
      onPress={() => handleSort(type)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: sortBy === type ? colors.background : colors.text,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.h2,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            {categoryName} Services
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            {filteredProviders.length} providers available
          </Text>
        </View>

        {/* Sort Options */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '500',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            Sort by:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <SortButton type="rating" label="Rating" />
            <SortButton type="price" label="Price" />
            <SortButton type="distance" label="Distance" />
            <SortButton type="experience" label="Experience" />
          </View>
        </View>

        {/* Filter Options */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setFilterVerified(!filterVerified)}
          >
            <View style={{
              width: responsiveWidth(20),
              height: responsiveWidth(20),
              borderRadius: responsiveWidth(10),
              backgroundColor: filterVerified ? colors.primary : colors.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.sm,
            }}>
              {filterVerified && (
                <Text style={{ color: colors.background, fontSize: responsiveWidth(12) }}>✓</Text>
              )}
            </View>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              Verified providers only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Providers List */}
        <FlatList
          data={filteredProviders}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>🔍</Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}>
                No providers found
              </Text>
            </View>
          }
        />
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

export default ServiceProvidersScreen;
