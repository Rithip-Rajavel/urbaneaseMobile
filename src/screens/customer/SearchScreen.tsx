import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockSearchResults = {
  providers: [
    { id: 1, name: 'Sarah Smith', service: 'Home Cleaning', rating: 4.8, price: 25, avatar: '👩‍🔧' },
    { id: 2, name: 'Mike Johnson', service: 'Plumbing', rating: 4.9, price: 45, avatar: '👨‍🔧' },
    { id: 3, name: 'Lisa Davis', service: 'Cooking', rating: 4.7, price: 30, avatar: '👩‍🍳' },
  ],
  services: [
    { id: 1, name: 'Deep Cleaning', category: 'Cleaning', price: 35, icon: '🧹' },
    { id: 2, name: 'Regular Cleaning', category: 'Cleaning', price: 25, icon: '🧹' },
    { id: 3, name: 'Pipe Repair', category: 'Plumbing', price: 55, icon: '🔧' },
  ],
  categories: [
    { id: 1, name: 'Cleaning', icon: '🧹', servicesCount: 15 },
    { id: 2, name: 'Plumbing', icon: '🔧', servicesCount: 8 },
    { id: 3, name: 'Cooking', icon: '👨‍🍳', servicesCount: 12 },
  ],
};

const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState(mockSearchResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would make an API call
    // For now, we'll just filter the mock data
    if (query.trim() === '') {
      setSearchResults(mockSearchResults);
    } else {
      const filtered = {
        providers: mockSearchResults.providers.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.service.toLowerCase().includes(query.toLowerCase())
        ),
        services: mockSearchResults.services.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
        ),
        categories: mockSearchResults.categories.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase())
        ),
      };
      setSearchResults(filtered);
    }
  };

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
        <Text style={{ fontSize: responsiveWidth(20) }}>{item.avatar}</Text>
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
          marginBottom: spacing.xs,
        }}>
          {item.service}
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
            fontSize: typography.body,
            fontWeight: 'bold',
            color: colors.primary,
            marginLeft: spacing.sm,
          }}>
            ${item.price}/hr
          </Text>
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
      onPress={() => navigation.navigate('ServiceProviders', { categoryId: 1 })}
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
        <Text style={{ fontSize: responsiveWidth(20) }}>{item.icon}</Text>
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
          {item.category}
        </Text>
        <Text style={{
          fontSize: typography.body,
          fontWeight: 'bold',
          color: colors.primary,
          marginTop: spacing.xs,
        }}>
          ${item.price}/hr
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: any) => (
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
      onPress={() => navigation.navigate('Categories')}
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
        <Text style={{ fontSize: responsiveWidth(20) }}>{item.icon}</Text>
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
          {item.servicesCount} services available
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
          {searchResults.providers.length > 0 && (
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
              {searchResults.providers.map((item) => (
                <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                  {renderProviderItem({ item })}
                </View>
              ))}
            </View>
          )}
          
          {searchResults.services.length > 0 && (
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
              {searchResults.services.map((item) => (
                <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                  {renderServiceItem({ item })}
                </View>
              ))}
            </View>
          )}
          
          {searchResults.categories.length > 0 && (
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
              {searchResults.categories.map((item) => (
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
          data={searchResults.providers}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      );
    } else if (activeTab === 'services') {
      return (
        <FlatList
          data={searchResults.services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      return (
        <FlatList
          data={searchResults.categories}
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
