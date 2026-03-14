import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import messageService from '../../services/messageService';
import { Booking, Review, Message } from '../../types';

interface DashboardStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  completedJobs: number;
  pendingJobs: number;
  averageRating: number;
  totalReviews: number;
  activeBookings: number;
  upcomingBookings: number;
  completionRate: number;
  avgJobTime: number;
}

const ProviderDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    completedJobs: 0,
    pendingJobs: 0,
    averageRating: 0,
    totalReviews: 0,
    activeBookings: 0,
    upcomingBookings: 0,
    completionRate: 0,
    avgJobTime: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load recent bookings
      const bookingsResponse = await bookingService.getMyBookings();
      const bookings = bookingsResponse.slice(0, 5); // Get only 5 recent bookings
      setRecentBookings(bookings);
      
      // Calculate stats from bookings
      const completedBookings = bookingsResponse.filter(b => b.status === 'COMPLETED');
      const pendingBookings = bookingsResponse.filter(b => b.status === 'PENDING');
      const activeBookings = bookingsResponse.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status));
      
      const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthEarnings = completedBookings
        .filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        })
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      // Load reviews for rating stats
      let averageRating = 0;
      let totalReviews = 0;
      if (user?.id) {
        try {
          const reviewsResponse = await reviewService.getProviderReviews(user.id);
          totalReviews = reviewsResponse.length;
          if (totalReviews > 0) {
            averageRating = reviewsResponse.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
          }
        } catch (error) {
          console.error('Error loading reviews:', error);
        }
      }
      
      // Load unread messages count
      let unreadCount = 0;
      try {
        const unreadResponse = await messageService.getUnreadCount();
        unreadCount = unreadResponse || 0;
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
      
      // Calculate completion rate and average job time
      const completionRate = bookingsResponse.length > 0 
        ? (completedBookings.length / bookingsResponse.length) * 100 
        : 0;
      
      // Average job time (estimated - would need start/end times from API)
      const avgJobTime = 2.5; // hours - placeholder
      
      setStats({
        totalEarnings,
        thisMonthEarnings,
        completedJobs: completedBookings.length,
        pendingJobs: pendingBookings.length,
        averageRating,
        totalReviews,
        activeBookings: activeBookings.length,
        upcomingBookings: pendingBookings.length,
        completionRate,
        avgJobTime,
      });
      
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const BookingItem = ({ item }: { item: Booking }) => (
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
          {item.service.name}
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
            {item.status.replace('_', ' ')}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {item.customer.username} • {formatBookingDate(item.scheduledTime || item.createdAt)}
        </Text>
        <Text style={{
          fontSize: typography.body,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.totalAmount || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading dashboard...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
                Messages {unreadCount > 0 && `(${unreadCount})`}
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
                {stats.completionRate.toFixed(0)}%
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
                {stats.averageRating.toFixed(1)}
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
                {stats.avgJobTime}h
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
      )}
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
