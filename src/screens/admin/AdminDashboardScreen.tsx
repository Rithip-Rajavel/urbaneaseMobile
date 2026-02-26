import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockStats = {
  totalUsers: 1247,
  totalProviders: 342,
  totalBookings: 5621,
  totalRevenue: 125430,
  pendingVerifications: 23,
  activeBookings: 89,
};

const mockRecentActivity = [
  { id: 1, type: 'new_user', user: 'John Doe', time: '2 mins ago' },
  { id: 2, type: 'booking', user: 'Sarah Smith', service: 'Cleaning', time: '5 mins ago' },
  { id: 3, type: 'provider_verification', user: 'Mike Johnson', time: '12 mins ago' },
  { id: 4, type: 'payment', user: 'Emma Wilson', amount: '$45', time: '1 hour ago' },
];

const AdminDashboardScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ title, value, subtitle, onPress, color = colors.primary }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flex: 1,
        marginHorizontal: spacing.xs,
        ...shadows.small,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{
        fontSize: typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: typography.h3,
        fontWeight: 'bold',
        color: color,
        marginBottom: spacing.xs,
      }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }: any) => {
    const getIcon = () => {
      switch (item.type) {
        case 'new_user': return '👤';
        case 'booking': return '📅';
        case 'provider_verification': return '✓';
        case 'payment': return '💰';
        default: return '📄';
      }
    };

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.md }}>
          {getIcon()}
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: typography.body,
            color: colors.text,
            fontWeight: '500',
          }}>
            {item.user}
            {item.service && ` - ${item.service}`}
            {item.amount && ` - ${item.amount}`}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

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
          <Text style={{
            fontSize: typography.h2,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            Admin Dashboard
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage your UrbanEase platform
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              onPress={() => navigation.navigate('Users')}
            />
            <StatCard
              title="Providers"
              value={stats.totalProviders.toLocaleString()}
              subtitle="Verified"
              onPress={() => navigation.navigate('Providers')}
              color={colors.secondary}
            />
          </View>
          
          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              onPress={() => navigation.navigate('Bookings')}
              color={colors.warning}
            />
            <StatCard
              title="Revenue"
              value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
              subtitle="This month"
              color={colors.success}
            />
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <StatCard
              title="Pending"
              value={stats.pendingVerifications}
              subtitle="Verifications"
              onPress={() => navigation.navigate('Providers')}
              color={colors.error}
            />
            <StatCard
              title="Active"
              value={stats.activeBookings}
              subtitle="Bookings"
              onPress={() => navigation.navigate('Bookings')}
              color={colors.info}
            />
          </View>
        </View>

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
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
                marginBottom: spacing.sm,
              }}
              onPress={() => navigation.navigate('Users')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Manage Users
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.secondary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
                marginBottom: spacing.sm,
              }}
              onPress={() => navigation.navigate('Providers')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Verify Providers
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.warning,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
              }}
              onPress={() => navigation.navigate('Bookings')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                View Bookings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.info,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
              }}
              onPress={() => navigation.navigate('Categories')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Categories
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Recent Activity
          </Text>
          
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            ...shadows.small,
          }}>
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
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

export default AdminDashboardScreen;
