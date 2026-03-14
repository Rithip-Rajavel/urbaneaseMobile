import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import { Booking } from '../../types';

const BookingsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings(
        selectedStatus === 'ALL' ? undefined : selectedStatus
      );
      setBookings(data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const handleCancelBooking = async (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          onPress: async () => {
            try {
              await bookingService.cancelBooking(booking.id);
              fetchBookings();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleReview = (booking: Booking) => {
    navigation.navigate('Reviews', { bookingId: booking.id });
  };

  const filteredBookings = selectedStatus === 'ALL'
    ? bookings
    : bookings.filter(booking => booking.status === selectedStatus);

  const renderBookingItem = ({ item }: { item: Booking }) => (
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {item.service?.name || 'Service'}
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            Provider: {item.provider?.username || 'Provider'}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {new Date(item.scheduledTime || item.createdAt).toLocaleDateString()} at {new Date(item.scheduledTime || item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        <View style={{
          backgroundColor: bookingService.getBookingStatusColor(item.status),
          borderRadius: borderRadius.xs,
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.background,
            fontWeight: '500',
          }}>
            {bookingService.getBookingStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.h3,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.totalAmount || 0}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.review && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.sm }}>
              <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
                ⭐
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                fontWeight: '500',
              }}>
                {item.review.rating}.0
              </Text>
            </View>
          )}

          {bookingService.canCancelBooking(item, user?.role || 'CUSTOMER') && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.error,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
              }}
              onPress={() => handleCancelBooking(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}

          {bookingService.canReviewBooking(item, user?.role || 'CUSTOMER') && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
              }}
              onPress={() => handleReview(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Review
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ status, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedStatus === status ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: selectedStatus === status ? colors.primary : colors.border,
      }}
      onPress={() => setSelectedStatus(status)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: selectedStatus === status ? colors.background : colors.text,
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
            My Bookings
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage your service bookings
          </Text>
        </View>

        {/* Filters */}
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
            Filter by Status:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <FilterButton status="ALL" label="All" />
            <FilterButton status="PENDING" label="Pending" />
            <FilterButton status="ACCEPTED" label="Accepted" />
            <FilterButton status="IN_PROGRESS" label="In Progress" />
            <FilterButton status="COMPLETED" label="Completed" />
            <FilterButton status="CANCELLED" label="Cancelled" />
          </View>
        </View>

        {/* Bookings List */}
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>📅</Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}>
                No bookings found
              </Text>
            </View>
          }
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
            Total: {filteredBookings.length} bookings •
            Completed: {filteredBookings.filter(b => b.status === 'COMPLETED').length} •
            Active: {filteredBookings.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length}
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

export default BookingsScreen;
