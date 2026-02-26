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
const mockCategories = [
  { id: 1, name: 'Cleaning', description: 'Professional cleaning services', icon: '🧹', active: true, servicesCount: 15 },
  { id: 2, name: 'Plumbing', description: 'Expert plumbing solutions', icon: '🔧', active: true, servicesCount: 8 },
  { id: 3, name: 'Cooking', description: 'Home cooking and meal prep', icon: '👨‍🍳', active: true, servicesCount: 12 },
  { id: 4, name: 'Electrical', description: 'Electrical repairs and installation', icon: '⚡', active: false, servicesCount: 6 },
];

const CategoriesManagementScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState(mockCategories);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('CategoryForm', { categoryId: category.id });
  };

  const handleAddCategory = () => {
    navigation.navigate('CategoryForm');
  };

  const handleToggleCategory = (category: any) => {
    Alert.alert(
      'Toggle Category',
      `Are you sure you want to ${category.active ? 'deactivate' : 'activate'} this category?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: category.active ? 'Deactivate' : 'Activate',
          onPress: () => {
            setCategories(prevCategories =>
              prevCategories.map(c =>
                c.id === category.id ? { ...c, active: !c.active } : c
              )
            );
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: any) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows.small,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <View style={{
          width: responsiveWidth(40),
          height: responsiveWidth(40),
          borderRadius: borderRadius.sm,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
          <Text style={{ fontSize: responsiveWidth(24) }}>{item.icon}</Text>
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
            {item.description}
          </Text>
        </View>
        <View style={{
          backgroundColor: item.active ? colors.success : colors.error,
          borderRadius: borderRadius.xs,
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.background,
            fontWeight: '500',
          }}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {item.servicesCount} services
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
              marginRight: spacing.sm,
            }}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: item.active ? colors.error : colors.success,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
            }}
            onPress={() => handleToggleCategory(item)}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              {item.active ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
            Categories Management
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage service categories
          </Text>
        </View>

        {/* Add Category Button */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
            }}
            onPress={handleAddCategory}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              Add New Category
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Stats */}
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
            Total: {categories.length} categories • 
            Active: {categories.filter(c => c.active).length} • 
            Inactive: {categories.filter(c => !c.active).length}
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

export default CategoriesManagementScreen;
