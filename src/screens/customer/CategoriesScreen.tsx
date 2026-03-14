import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import serviceService from '../../services/serviceService';
import { ServiceCategory } from '../../types';

const CategoriesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await serviceService.getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const handleCategoryPress = (category: ServiceCategory) => {
    navigation.navigate('ServiceProviders', { 
      categoryId: category.id, 
      categoryName: category.name 
    });
  };

  const renderCategoryItem = ({ item }: { item: ServiceCategory }) => (
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
        {item.iconUrl ? (
          <Image source={{ uri: item.iconUrl }} style={{ width: 30, height: 30, tintColor: colors.primary }} />
        ) : (
          <Text style={{ fontSize: responsiveWidth(30) }}>✨</Text>
        )}
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
        
        {/* Removed mock stats */}
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
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
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
        )}

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
            {categories.length} categories available
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
