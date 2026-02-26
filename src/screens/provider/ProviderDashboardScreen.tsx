import React, { useState } from 'react';
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
  totalEarnings: 3456.78,
  thisMonthEarnings: 892.45,
  completedJobs: 156,
  pendingJobs: 3,
  averageRating: 4.8,
  totalReviews: 127,
  activeBookings: 2,
  upcomingBookings: 1,
};

const mockRecentBookings = [
  { id: 1, service: 'Home Cleaning', customer: 'John Doe', date: 'Today, 2:00 PM', status: 'IN_PROGRESS', amount: 45 },
  { id: 2, service: 'Plumbing', customer: 'Sarah Smith', date: 'Tomorrow, 10:00 AM', status: 'ACCEPTED', amount: 85 },
  { id: 3, service: 'Cooking', customer: 'Mike Johnson', date: 'Yesterday', status: 'COMPLETED', amount: 60 },
];

const ProviderDashboardScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState(mockStats);
  const [recentBookings, setRecentBookings] = useState(mockRecentBookings);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleBookingPress = (booking: any) => {
    navigation.navigate('ProviderBookingDetails', { bookingId: booking.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return colors.success;
      case 'IN_PROGRESS': return colors.info;
      case 'ACCEPTED': return colors.primary;
      case 'PENDING': return colors.warning;
      default: return colors.textSecondary;
    }
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

  const BookingItem = ({ item }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.small,
      }}
      onPress={() => handleBookingPress(item)}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          flex: 1,
        }}>
          {item.service}
        </Text>
        <View style={{
          backgroundColor: getStatusColor(item.status),
          borderRadius: borderRadius.xs,
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.background,
            fontWeight: '500',
          }}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {item.customer} • {item.date}
        </Text>
        <Text style={{
          fontSize: typography.body,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
            Provider Dashboard
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage your services and earnings
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <StatCard
              title="Total Earnings"
              value={`$${stats.totalEarnings.toFixed(2)}`}
              onPress={() => navigation.navigate('Earnings')}
              color={colors.success}
            />
            <StatCard
              title="This Month"
              value={`$${stats.thisMonthEarnings.toFixed(2)}`}
              onPress={() => navigation.navigate('Earnings')}
              color={colors.primary}
            />
          </View>
          
          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <StatCard
              title="Completed Jobs"
              value={stats.completedJobs.toString()}
              onPress={() => navigation.navigate('Bookings')}
              color={colors.info}
            />
            <StatCard
              title="Pending Jobs"
              value={stats.pendingJobs.toString()}
              onPress={() => navigation.navigate('Bookings')}
              color={colors.warning}
            />
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <StatCard
              title="Average Rating"
              value={`⭐ ${stats.averageRating}`}
              subtitle={`(${stats.totalReviews} reviews)`}
              onPress={() => navigation.navigate('Reviews')}
              color={colors.warning}
            />
            <StatCard
              title="Active Bookings"
              value={stats.activeBookings.toString()}
              onPress={() => navigation.navigate('Bookings')}
              color={colors.success}
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
                backgroundColor: colors.success,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
                marginBottom: spacing.sm,
              }}
              onPress={() => navigation.navigate('Earnings')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                View Earnings
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.info,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                alignItems: 'center',
                width: '48%',
              }}
              onPress={() => navigation.navigate('Messages')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Messages
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
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Recent Bookings
          </Text>
          
          {recentBookings.map((booking) => (
            <BookingItem key={booking.id} item={booking} />
          ))}
        </View>

        {/* Performance Overview */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.xl,
          ...shadows.small,
        }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Performance Overview
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                95%
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Completion Rate
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
                4.8
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Avg Rating
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.info,
              }}>
                2.5h
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Avg Job Time
              </Text>
            </View>
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

export default ProviderDashboardScreen;
