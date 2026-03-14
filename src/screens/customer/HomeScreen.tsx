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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import serviceService from '../../services/serviceService';
import { MAP_CONFIG } from '../../constants';
// Define types based on what we need or from types/index
import { ServiceCategory, ProviderProfile } from '../../types';

const HomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [topProviders, setTopProviders] = useState<ProviderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      const [cats, provs] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getNearbyProviders(
          user?.currentLocation?.latitude || MAP_CONFIG.DEFAULT_LATITUDE,
          user?.currentLocation?.longitude || MAP_CONFIG.DEFAULT_LONGITUDE,
          MAP_CONFIG.SEARCH_RADIUS
        )
      ]);
      setCategories(cats);
      // Let's assume the top providers are the first few returned
      setTopProviders(provs.slice(0, 5));
    } catch (error: any) {
      console.error('Error fetching home data:', error);
      Alert.alert('Error', 'Failed to load data. Please pull to refresh.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
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

  const renderCategoryItem = ({ item }: { item: ServiceCategory }) => (
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
        {item.iconUrl ? (
          <Image source={{ uri: item.iconUrl }} style={{ width: 24, height: 24, tintColor: colors.primary }} />
        ) : (
          <Text style={{ fontSize: responsiveWidth(24) }}>✨</Text>
        )}
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

  const renderProviderItem = ({ item }: { item: ProviderProfile }) => (
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
        {item.profileImageUrl ? (
          <Image source={{ uri: item.profileImageUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        ) : (
          <Text style={{ fontSize: responsiveWidth(20) }}>👤</Text>
        )}
      </View>
      
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginRight: spacing.sm,
          }}>
            {item.businessName || item.user.username || item.fullName || 'Provider'}
          </Text>
          {item.verificationStatus === 'VERIFIED' && (
            <Text style={{ fontSize: responsiveWidth(16) }}>✓</Text>
          )}
        </View>
        
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.yearsOfExperience ? `${item.yearsOfExperience} yrs exp` : ''} 
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
            {item.averageRating || 0}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
            marginLeft: spacing.xs,
          }}>
            ({item.totalReviews || 0} reviews)
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

        {isLoading ? (
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
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
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: spacing.lg, paddingRight: spacing.lg }}
            />
          </View>
        )}

        {!isLoading && topProviders.length > 0 && (
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
              {topProviders.map((provider) => (
                <View key={provider.id}>
                  {renderProviderItem({ item: provider })}
                </View>
              ))}
            </View>
          </View>
        )}

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
