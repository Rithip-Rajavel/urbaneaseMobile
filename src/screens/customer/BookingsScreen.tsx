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
const mockBookings = [
  { 
    id: 1, 
    service: 'Home Cleaning', 
    provider: 'Sarah Smith', 
    status: 'COMPLETED', 
    date: '2024-02-20', 
    time: '10:00 AM',
    amount: 45,
    rating: 5,
    canReview: true
  },
  { 
    id: 2, 
    service: 'Plumbing Repair', 
    provider: 'Mike Johnson', 
    status: 'IN_PROGRESS', 
    date: '2024-02-21', 
    time: '2:00 PM',
    amount: 85,
    rating: null,
    canReview: false
  },
  { 
    id: 3, 
    service: 'Cooking', 
    provider: 'Lisa Davis', 
    status: 'ACCEPTED', 
    date: '2024-02-22', 
    time: '6:00 PM',
    amount: 60,
    rating: null,
    canReview: false
  },
  { 
    id: 4, 
    service: 'Gardening', 
    provider: 'Tom Wilson', 
    status: 'PENDING', 
    date: '2024-02-23', 
    time: '9:00 AM',
    amount: 35,
    rating: null,
    canReview: false
  },
  { 
    id: 5, 
    service: 'Electrical Work', 
    provider: 'Alex Brown', 
    status: 'CANCELLED', 
    date: '2024-02-19', 
    time: '11:00 AM',
    amount: 55,
    rating: null,
    canReview: false
  },
];

const BookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState(mockBookings);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleBookingPress = (booking: any) => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const handleCancelBooking = (booking: any) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          onPress: () => {
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'CANCELLED' } : b
              )
            );
          },
        },
      ]
    );
  };

  const handleReview = (booking: any) => {
    navigation.navigate('Reviews', { bookingId: booking.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return colors.success;
      case 'IN_PROGRESS': return colors.info;
      case 'PENDING': return colors.warning;
      case 'ACCEPTED': return colors.primary;
      case 'CANCELLED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'IN_PROGRESS': return 'In Progress';
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const filteredBookings = selectedStatus === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const renderBookingItem = ({ item }: any) => (
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
            {item.service}
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            Provider: {item.provider}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {item.date} at {item.time}
          </Text>
        </View>
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
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.h3,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.amount}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.sm }}>
              <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
                ⭐
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.text,
                fontWeight: '500',
              }}>
                {item.rating}.0
              </Text>
            </View>
          )}
          
          {item.status === 'PENDING' && (
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
          
          {item.canReview && (
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
