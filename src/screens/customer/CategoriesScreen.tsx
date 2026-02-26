import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockCategories = [
  { 
    id: 1, 
    name: 'Cleaning', 
    description: 'Professional cleaning services for homes and offices', 
    icon: '🧹', 
    servicesCount: 15,
    activeProviders: 45,
    avgPrice: 25
  },
  { 
    id: 2, 
    name: 'Plumbing', 
    description: 'Expert plumbing solutions for all your needs', 
    icon: '🔧', 
    servicesCount: 8,
    activeProviders: 23,
    avgPrice: 45
  },
  { 
    id: 3, 
    name: 'Cooking', 
    description: 'Home cooking and meal preparation services', 
    icon: '👨‍🍳', 
    servicesCount: 12,
    activeProviders: 34,
    avgPrice: 30
  },
  { 
    id: 4, 
    name: 'Electrical', 
    description: 'Electrical repairs and installation services', 
    icon: '⚡', 
    servicesCount: 6,
    activeProviders: 18,
    avgPrice: 55
  },
  { 
    id: 5, 
    name: 'Gardening', 
    description: 'Garden maintenance and landscaping services', 
    icon: '🌱', 
    servicesCount: 10,
    activeProviders: 27,
    avgPrice: 35
  },
  { 
    id: 6, 
    name: 'Painting', 
    description: 'Interior and exterior painting services', 
    icon: '🎨', 
    servicesCount: 7,
    activeProviders: 21,
    avgPrice: 40
  },
  { 
    id: 7, 
    name: 'Carpentry', 
    description: 'Custom carpentry and furniture work', 
    icon: '🔨', 
    servicesCount: 9,
    activeProviders: 19,
    avgPrice: 50
  },
  { 
    id: 8, 
    name: 'Appliance Repair', 
    description: 'Home appliance repair and maintenance', 
    icon: '🔌', 
    servicesCount: 11,
    activeProviders: 25,
    avgPrice: 60
  },
];

const CategoriesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState(mockCategories);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ServiceProviders', { 
      categoryId: category.id, 
      categoryName: category.name 
    });
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small,
      }}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(60),
        height: responsiveWidth(60),
        borderRadius: borderRadius.md,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(30) }}>{item.icon}</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.h4,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.name}
        </Text>
        
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
          lineHeight: typography.caption * 1.3,
        }}>
          {item.description}
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginRight: spacing.sm,
            }}>
              {item.servicesCount} services
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              • {item.activeProviders} providers
            </Text>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              Avg. Price
            </Text>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '600',
              color: colors.primary,
            }}>
              ${item.avgPrice}/hr
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{
        marginLeft: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20), color: colors.textLight }}>
          ›
        </Text>
      </View>
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
            Categories
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Choose a service category
          </Text>
        </View>

        {/* Categories List */}
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ 
            paddingHorizontal: spacing.lg, 
            paddingBottom: spacing.lg 
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
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
            {categories.length} categories available • 
            {categories.reduce((sum, cat) => sum + cat.activeProviders, 0)} active providers
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

export default CategoriesScreen;
