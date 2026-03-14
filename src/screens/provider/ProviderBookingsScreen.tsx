import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import { Booking } from '../../types';

const ProviderBookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsResponse = await bookingService.getMyBookings();
      setBookings(bookingsResponse);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (booking: any) => {
    navigation.navigate('ProviderBookingDetails', { bookingId: booking.id });
  };

  const handleAcceptBooking = async (booking: Booking) => {
    Alert.alert(
      'Accept Booking',
      `Accept booking from ${booking.customer.username} for ${booking.service.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setActionLoading(booking.id);
              const updatedBooking = await bookingService.acceptBooking(booking.id);
              setBookings(prevBookings =>
                prevBookings.map(b => b.id === booking.id ? updatedBooking : b)
              );
              Alert.alert('Success', 'Booking has been accepted.');
            } catch (error) {
              console.error('Error accepting booking:', error);
              Alert.alert('Error', 'Failed to accept booking. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleRejectBooking = async (booking: Booking) => {
    Alert.alert(
      'Reject Booking',
      `Reject booking from ${booking.customer.username} for ${booking.service.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              setActionLoading(booking.id);
              const updatedBooking = await bookingService.rejectBooking(booking.id);
              setBookings(prevBookings =>
                prevBookings.map(b => b.id === booking.id ? updatedBooking : b)
              );
              Alert.alert('Rejected', 'Booking has been rejected.');
            } catch (error) {
              console.error('Error rejecting booking:', error);
              Alert.alert('Error', 'Failed to reject booking. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleStartService = async (booking: Booking) => {
    Alert.alert(
      'Start Service',
      `Start ${booking.service.name} for ${booking.customer.username}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              setActionLoading(booking.id);
              const updatedBooking = await bookingService.startService(booking.id);
              setBookings(prevBookings =>
                prevBookings.map(b => b.id === booking.id ? updatedBooking : b)
              );
              Alert.alert('Started', 'Service has been started.');
            } catch (error) {
              console.error('Error starting service:', error);
              Alert.alert('Error', 'Failed to start service. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleCompleteService = async (booking: Booking) => {
    Alert.alert(
      'Complete Service',
      `Mark ${booking.service.name} as completed for ${booking.customer.username}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              setActionLoading(booking.id);
              const updatedBooking = await bookingService.completeService(booking.id);
              setBookings(prevBookings =>
                prevBookings.map(b => b.id === booking.id ? updatedBooking : b)
              );
              Alert.alert('Completed', 'Service has been marked as completed.');
            } catch (error) {
              console.error('Error completing service:', error);
              Alert.alert('Error', 'Failed to complete service. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return colors.success;
      case 'IN_PROGRESS': return colors.info;
      case 'PENDING': return colors.warning;
      case 'ACCEPTED': return colors.primary;
      case 'REJECTED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'IN_PROGRESS': return 'In Progress';
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const canAccept = (booking: Booking) => booking.status === 'PENDING';
  const canReject = (booking: Booking) => booking.status === 'PENDING';
  const canStart = (booking: Booking) => booking.status === 'ACCEPTED';
  const canComplete = (booking: Booking) => booking.status === 'IN_PROGRESS';

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatBookingTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const filteredBookings = selectedStatus === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows.small,
    }}>
      <TouchableOpacity
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
              {item.service.name}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Customer: {item.customer.username}
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginBottom: spacing.xs,
            }}>
              {formatBookingDate(item.scheduledTime || item.createdAt)} at {formatBookingTime(item.scheduledTime || item.createdAt)}
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              📍 {item.serviceLocation.address || 'Location not specified'}
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
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            ${item.totalAmount || 0}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            📞 {item.customer.mobileNumber || 'No phone'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {canAccept(item) && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                marginRight: spacing.xs,
                opacity: actionLoading === item.id ? 0.5 : 1,
              }}
              onPress={() => handleAcceptBooking(item)}
              disabled={actionLoading === item.id}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '600',
                }}>
                  Accept
                </Text>
              )}
            </TouchableOpacity>
          )}
          
          {canReject(item) && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.error,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                marginRight: spacing.xs,
                opacity: actionLoading === item.id ? 0.5 : 1,
              }}
              onPress={() => handleRejectBooking(item)}
              disabled={actionLoading === item.id}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '600',
                }}>
                  Reject
                </Text>
              )}
            </TouchableOpacity>
          )}
          
          {canStart(item) && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.info,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                marginRight: spacing.xs,
                opacity: actionLoading === item.id ? 0.5 : 1,
              }}
              onPress={() => handleStartService(item)}
              disabled={actionLoading === item.id}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '600',
                }}>
                  Start
                </Text>
              )}
            </TouchableOpacity>
          )}
          
          {canComplete(item) && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.success,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                opacity: actionLoading === item.id ? 0.5 : 1,
              }}
              onPress={() => handleCompleteService(item)}
              disabled={actionLoading === item.id}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '600',
                }}>
                  Complete
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading bookings...</Text>
        </View>
      ) : (
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
            <FilterButton status="REJECTED" label="Rejected" />
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
      </View>
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

export default ProviderBookingsScreen;
