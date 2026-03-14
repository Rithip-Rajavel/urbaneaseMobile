import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import serviceService from '../../services/serviceService';
import { useAuth } from '../../context/AuthContext';
import { ServiceCategory, ProviderProfile } from '../../types';
import { MAP_CONFIG } from '../../constants';

const SearchScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [filteredResults, setFilteredResults] = useState<{
    providers: ProviderProfile[];
    categories: ServiceCategory[];
    services: any[];
  }>({
    providers: [],
    categories: [],
    services: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, providersData] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getNearbyProviders(
          user?.currentLocation?.latitude || MAP_CONFIG.DEFAULT_LATITUDE,
          user?.currentLocation?.longitude || MAP_CONFIG.DEFAULT_LONGITUDE,
          MAP_CONFIG.SEARCH_RADIUS
        )
      ]);
      setCategories(categoriesData);
      setProviders(providersData);
      setFilteredResults({
        providers: providersData,
        categories: categoriesData,
        services: []
      });
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      if (query.trim() === '') {
        setFilteredResults({
          providers: providers,
          categories: categories,
          services: []
        });
      } else {
        const searchResponse = await serviceService.searchServicesAndProviders(query);

        const filteredProviders = providers.filter(p =>
          p.firstName?.toLowerCase().includes(query.toLowerCase()) ||
          p.lastName?.toLowerCase().includes(query.toLowerCase()) ||
          p.user?.username?.toLowerCase().includes(query.toLowerCase())
        );

        const filteredCategories = categories.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredResults({
          providers: filteredProviders,
          categories: filteredCategories,
          services: searchResponse.categories || []
        });
      }
    } catch (error: any) {
      console.error('Error searching:', error);
      // Fallback to client-side filtering
      const filteredProviders = providers.filter(p =>
        p.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        p.user?.username?.toLowerCase().includes(query.toLowerCase())
      );

      const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredResults({
        providers: filteredProviders,
        categories: filteredCategories,
        services: []
      });
    } finally {
      setIsSearching(false);
    }
  };

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
      onPress={() => navigation.navigate('BookingDetails', { providerId: item.id })}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: borderRadius.sm,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20) }}>👤</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          @{item.user?.username}
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
            {item.averageRating || 'N/A'}
          </Text>
          {item.verificationStatus === 'VERIFIED' && (
            <Text style={{
              fontSize: responsiveWidth(12),
              color: colors.success,
              marginLeft: spacing.sm,
              fontWeight: '600',
            }}>
              ✓ Verified
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }: any) => (
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
      onPress={() => navigation.navigate('ServiceProviders', { categoryId: item.id })}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: borderRadius.sm,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20) }}>🔧</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.name}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
        }}>
          {item.category?.name || 'Service'}
        </Text>
        <Text style={{
          fontSize: typography.body,
          fontWeight: 'bold',
          color: colors.primary,
          marginTop: spacing.xs,
        }}>
          ${item.basePrice || 0}/hr
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: ServiceCategory }) => (
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
      onPress={() => navigation.navigate('ServiceProviders', { categoryId: item.id, categoryName: item.name })}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: borderRadius.sm,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20) }}>{item.iconUrl ? '📁' : '📂'}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.name}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
        }}>
          {item.services?.length || 0} services available
        </Text>
      </View>
    </TouchableOpacity>
  );

  const TabButton = ({ tab, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: activeTab === tab ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: activeTab === tab ? colors.primary : colors.border,
      }}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: activeTab === tab ? colors.background : colors.text,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeTab === 'all') {
      return (
        <View>
          {filteredResults.providers.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: spacing.md,
                paddingHorizontal: spacing.lg,
              }}>
                Providers
              </Text>
              {filteredResults.providers.map((item) => (
                <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                  {renderProviderItem({ item })}
                </View>
              ))}
            </View>
          )}

          {filteredResults.services.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: spacing.md,
                paddingHorizontal: spacing.lg,
              }}>
                Services
              </Text>
              {filteredResults.services.map((item) => (
                <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                  {renderServiceItem({ item })}
                </View>
              ))}
            </View>
          )}

          {filteredResults.categories.length > 0 && (
            <View>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: spacing.md,
                paddingHorizontal: spacing.lg,
              }}>
                Categories
              </Text>
              {filteredResults.categories.map((item) => (
                <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                  {renderCategoryItem({ item })}
                </View>
              ))}
            </View>
          )}
        </View>
      );
    } else if (activeTab === 'providers') {
      return (
        <FlatList
          data={filteredResults.providers}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      );
    } else if (activeTab === 'services') {
      return (
        <FlatList
          data={filteredResults.services}
          renderItem={renderServiceItem}
          keyExtractor={(item: any) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      return (
        <FlatList
          data={filteredResults.categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

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
            Search
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Find providers, services, and categories
          </Text>
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
              placeholder="Search for anything..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <View style={{ flexDirection: 'row' }}>
            <TabButton tab="all" label="All" />
            <TabButton tab="providers" label="Providers" />
            <TabButton tab="services" label="Services" />
            <TabButton tab="categories" label="Categories" />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }}>
          {renderContent()}
        </ScrollView>
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

export default SearchScreen;
