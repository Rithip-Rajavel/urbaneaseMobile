import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockCategory = {
  id: null,
  name: '',
  description: '',
  iconUrl: '',
  active: true,
};

const CategoryFormScreen = ({ route, navigation }: any) => {
  const { categoryId } = route.params || { categoryId: null };
  const [category, setCategory] = useState(mockCategory);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setCategory(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!category.description.trim()) {
      newErrors.description = 'Category description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'Success',
      categoryId ? 'Category updated successfully!' : 'Category created successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const iconOptions = ['🧹', '🔧', '👨‍🍳', '⚡', '🌱', '🎨', '🔨', '🚗', '💻', '📱'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            {categoryId ? 'Edit Category' : 'Add New Category'}
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            {categoryId ? 'Update category information' : 'Create a new service category'}
          </Text>
        </View>

        {/* Form */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          {/* Category Name */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Category Name *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.name ? colors.error : colors.border,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                fontSize: typography.body,
                backgroundColor: colors.background,
              }}
              placeholder="Enter category name"
              placeholderTextColor={colors.textLight}
              value={category.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && (
              <Text style={{
                fontSize: typography.caption,
                color: colors.error,
                marginTop: spacing.xs,
              }}>
                {errors.name}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Description *
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.description ? colors.error : colors.border,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                fontSize: typography.body,
                backgroundColor: colors.background,
                height: responsiveHeight(100),
                textAlignVertical: 'top',
              }}
              placeholder="Enter category description"
              placeholderTextColor={colors.textLight}
              value={category.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
            />
            {errors.description && (
              <Text style={{
                fontSize: typography.caption,
                color: colors.error,
                marginTop: spacing.xs,
              }}>
                {errors.description}
              </Text>
            )}
          </View>

          {/* Icon Selection */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Select Icon
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: spacing.sm,
            }}>
              {iconOptions.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: responsiveWidth(50),
                    height: responsiveWidth(50),
                    borderRadius: borderRadius.sm,
                    backgroundColor: category.iconUrl === icon ? colors.primary : colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing.sm,
                    marginBottom: spacing.sm,
                    borderWidth: 1,
                    borderColor: category.iconUrl === icon ? colors.primary : colors.border,
                  }}
                  onPress={() => handleInputChange('iconUrl', icon || '')}
                >
                  <Text style={{ fontSize: responsiveWidth(24) }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Status */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Status
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                style={{
                  width: responsiveWidth(20),
                  height: responsiveWidth(20),
                  borderRadius: responsiveWidth(10),
                  backgroundColor: category.active ? colors.primary : colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.sm,
                }}
                onPress={() => handleInputChange('active', !category.active ? true : false)}
              >
                {category.active && (
                  <Text style={{ color: colors.background, fontSize: responsiveWidth(12) }}>✓</Text>
                )}
              </TouchableOpacity>
              <Text style={{
                fontSize: typography.body,
                color: colors.text,
              }}>
                {category.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}
            onPress={handleSave}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              {categoryId ? 'Update Category' : 'Create Category'}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              fontWeight: '600',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryFormScreen;
