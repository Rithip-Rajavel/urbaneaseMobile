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
    customer: 'John Doe', 
    status: 'PENDING', 
    date: '2024-02-22', 
    time: '10:00 AM',
    amount: 45,
    location: '123 Main St, City, State',
    customerPhone: '+1234567890'
  },
  { 
    id: 2, 
    service: 'Plumbing Repair', 
    customer: 'Sarah Smith', 
    status: 'ACCEPTED', 
    date: '2024-02-21', 
    time: '2:00 PM',
    amount: 85,
    location: '456 Oak Ave, City, State',
    customerPhone: '+0987654321'
  },
  { 
    id: 3, 
    service: 'Cooking', 
    customer: 'Mike Johnson', 
    status: 'IN_PROGRESS', 
    date: '2024-02-20', 
    time: '6:00 PM',
    amount: 60,
    location: '789 Pine Rd, City, State',
    customerPhone: '+1122334455'
  },
  { 
    id: 4, 
    service: 'Gardening', 
    customer: 'Emma Wilson', 
    status: 'COMPLETED', 
    date: '2024-02-19', 
    time: '9:00 AM',
    amount: 35,
    location: '321 Elm St, City, State',
    customerPhone: '+3344556677'
  },
];

const ProviderBookingsScreen = ({ navigation }: any) => {
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
    navigation.navigate('ProviderBookingDetails', { bookingId: booking.id });
  };

  const handleAcceptBooking = (booking: any) => {
    Alert.alert(
      'Accept Booking',
      `Accept booking from ${booking.customer} for ${booking.service}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'ACCEPTED' } : b
              )
            );
            Alert.alert('Success', 'Booking has been accepted.');
          },
        },
      ]
    );
  };

  const handleRejectBooking = (booking: any) => {
    Alert.alert(
      'Reject Booking',
      `Reject booking from ${booking.customer} for ${booking.service}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Reject',
          onPress: () => {
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'REJECTED' } : b
              )
            );
            Alert.alert('Rejected', 'Booking has been rejected.');
          },
        },
      ]
    );
  };

  const handleStartService = (booking: any) => {
    Alert.alert(
      'Start Service',
      `Start ${booking.service} for ${booking.customer}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'IN_PROGRESS' } : b
              )
            );
            Alert.alert('Started', 'Service has been started.');
          },
        },
      ]
    );
  };

  const handleCompleteService = (booking: any) => {
    Alert.alert(
      'Complete Service',
      `Mark ${booking.service} as completed for ${booking.customer}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? { ...b, status: 'COMPLETED' } : b
              )
            );
            Alert.alert('Completed', 'Service has been marked as completed.');
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

  const canAccept = (booking: any) => booking.status === 'PENDING';
  const canReject = (booking: any) => booking.status === 'PENDING';
  const canStart = (booking: any) => booking.status === 'ACCEPTED';
  const canComplete = (booking: any) => booking.status === 'IN_PROGRESS';

  const filteredBookings = selectedStatus === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const renderBookingItem = ({ item }: any) => (
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
              {item.service}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Customer: {item.customer}
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginBottom: spacing.xs,
            }}>
              {item.date} at {item.time}
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              📍 {item.location}
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
            ${item.amount}
          </Text>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            📞 {item.customerPhone}
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
              }}
              onPress={() => handleAcceptBooking(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Accept
              </Text>
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
              }}
              onPress={() => handleRejectBooking(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Reject
              </Text>
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
              }}
              onPress={() => handleStartService(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Start
              </Text>
            </TouchableOpacity>
          )}
          
          {canComplete(item) && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.success,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
              }}
              onPress={() => handleCompleteService(item)}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                Complete
              </Text>
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
            Pending: {filteredBookings.filter(b => b.status === 'PENDING').length} • 
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

export default ProviderBookingsScreen;
