import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockProviders = [
  {
    id: 1,
    name: 'Sarah Smith',
    service: 'Home Cleaning',
    rating: 4.8,
    reviews: 127,
    price: 25,
    experience: 5,
    verified: true,
    available: true,
    distance: '2.3 km',
    completedJobs: 156,
    description: 'Professional cleaning with eco-friendly products',
    avatar: '👩‍🔧'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    service: 'Home Cleaning',
    rating: 4.9,
    reviews: 89,
    price: 30,
    experience: 3,
    verified: true,
    available: true,
    distance: '1.8 km',
    completedJobs: 98,
    description: 'Specialized in deep cleaning and organization',
    avatar: '👨‍🔧'
  },
  {
    id: 3,
    name: 'Lisa Davis',
    service: 'Home Cleaning',
    rating: 4.7,
    reviews: 45,
    price: 22,
    experience: 2,
    verified: false,
    available: false,
    distance: '3.1 km',
    completedJobs: 67,
    description: 'Affordable and reliable cleaning services',
    avatar: '👩‍🔧'
  },
  {
    id: 4,
    name: 'Tom Wilson',
    service: 'Home Cleaning',
    rating: 4.6,
    reviews: 203,
    price: 28,
    experience: 7,
    verified: true,
    available: true,
    distance: '4.2 km',
    completedJobs: 234,
    description: 'Experienced cleaner with attention to detail',
    avatar: '👨‍🔧'
  },
];

const ServiceProvidersScreen = ({ route, navigation }: any) => {
  const { categoryId, categoryName } = route.params || { categoryId: 1, categoryName: 'Cleaning' };
  const [providers, setProviders] = useState(mockProviders);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filterVerified, setFilterVerified] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleProviderPress = (provider: any) => {
    navigation.navigate('BookingDetails', { providerId: provider.id });
  };

  const handleBookNow = (provider: any) => {
    Alert.alert(
      'Book Service',
      `Book ${provider.name} for ${provider.service}?`,
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

  const handleChat = (provider: any) => {
    navigation.navigate('Chat', { 
      providerId: provider.id, 
      userName: provider.name 
    });
  };

  const handleSort = (type: string) => {
    setSortBy(type);
    let sorted = [...providers];
    
    switch (type) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'distance':
        sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'experience':
        sorted.sort((a, b) => b.experience - a.experience);
        break;
    }
    
    setProviders(sorted);
  };

  const filteredProviders = filterVerified 
    ? providers.filter(p => p.verified)
    : providers;

  const renderProviderItem = ({ item }: any) => (
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
            <Text style={{ fontSize: responsiveWidth(30) }}>{item.avatar}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginRight: spacing.sm,
              }}>
                {item.name}
              </Text>
              {item.verified && (
                <Text style={{ fontSize: responsiveWidth(14), color: colors.success }}>✓</Text>
              )}
            </View>
            
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              {item.experience} years experience • {item.completedJobs} jobs completed
            </Text>
            
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginBottom: spacing.sm,
              lineHeight: typography.caption * 1.3,
            }}>
              {item.description}
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
                {item.rating}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textLight,
                marginRight: spacing.sm,
              }}>
                ({item.reviews} reviews)
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textLight,
              }}>
                • {item.distance}
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
            ${item.price}/hr
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
              backgroundColor: item.available ? colors.success : colors.error,
              marginRight: spacing.xs,
            }} />
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              {item.available ? 'Available' : 'Busy'}
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
              backgroundColor: item.available ? colors.primary : colors.textLight,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            }}
            onPress={() => handleBookNow(item)}
            disabled={!item.available}
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
