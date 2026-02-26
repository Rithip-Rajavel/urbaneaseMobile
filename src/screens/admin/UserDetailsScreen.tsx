import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockUser = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  mobileNumber: '+1234567890',
  role: 'CUSTOMER',
  active: true,
  createdAt: '2024-01-15',
  lastLogin: '2024-02-20',
  totalBookings: 15,
  completedBookings: 12,
};

const UserDetailsScreen = ({ route, navigation }: any) => {
  const { userId } = route.params || { userId: 1 };
  const [user, setUser] = useState(mockUser);

  const handleToggleUserStatus = () => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: user.active ? 'Deactivate' : 'Activate',
          onPress: () => {
            setUser(prev => ({ ...prev, active: !prev.active }));
          },
        },
      ]
    );
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      `Select new role for ${user.username}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Customer', onPress: () => setUser(prev => ({ ...prev, role: 'CUSTOMER' })) },
        { text: 'Provider', onPress: () => setUser(prev => ({ ...prev, role: 'SERVICE_PROVIDER' })) },
        { text: 'Admin', onPress: () => setUser(prev => ({ ...prev, role: 'ADMIN' })) },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return colors.error;
      case 'SERVICE_PROVIDER': return colors.secondary;
      case 'CUSTOMER': return colors.primary;
      default: return colors.textSecondary;
    }
  };

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
            User Details
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage user information and settings
          </Text>
        </View>

        {/* User Info Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.small,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <View style={{
              width: responsiveWidth(60),
              height: responsiveWidth(60),
              borderRadius: responsiveWidth(30),
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.md,
            }}>
              <Text style={{ fontSize: responsiveWidth(30) }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: typography.h4,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                {user.username}
              </Text>
              <View style={{
                backgroundColor: getRoleColor(user.role),
                borderRadius: borderRadius.xs,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                alignSelf: 'flex-start',
              }}>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '500',
                }}>
                  {user.role}
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: user.active ? colors.success : colors.error,
              borderRadius: borderRadius.xs,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '500',
              }}>
                {user.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Contact Information
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              marginBottom: spacing.xs,
            }}>
              {user.email}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {user.mobileNumber}
            </Text>
          </View>

          <View>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Account Information
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginBottom: spacing.xs,
            }}>
              Member since: {user.createdAt}
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              Last login: {user.lastLogin}
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.small,
        }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
                {user.totalBookings}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Total Bookings
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                {user.completedBookings}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Completed
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.warning,
              }}>
                {Math.round((user.completedBookings / user.totalBookings) * 100)}%
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Success Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Actions
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              marginBottom: spacing.sm,
            }}
            onPress={handleChangeRole}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              Change Role
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              backgroundColor: user.active ? colors.error : colors.success,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
            }}
            onPress={handleToggleUserStatus}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              {user.active ? 'Deactivate User' : 'Activate User'}
            </Text>
          </TouchableOpacity>
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

export default UserDetailsScreen;
