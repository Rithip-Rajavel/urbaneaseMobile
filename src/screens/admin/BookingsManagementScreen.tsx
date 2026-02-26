import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockBookings = [
  { id: 1, customer: 'John Doe', provider: 'Sarah Smith', service: 'Cleaning', status: 'COMPLETED', amount: 45, date: '2024-02-20' },
  { id: 2, customer: 'Emma Wilson', provider: 'Mike Johnson', service: 'Plumbing', status: 'IN_PROGRESS', amount: 85, date: '2024-02-21' },
  { id: 3, customer: 'Alex Brown', provider: 'Lisa Davis', service: 'Cooking', status: 'PENDING', amount: 60, date: '2024-02-22' },
  { id: 4, customer: 'Tom Harris', provider: 'Sarah Smith', service: 'Cleaning', status: 'ACCEPTED', amount: 40, date: '2024-02-23' },
];

const BookingsManagementScreen = ({ navigation }: any) => {
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
    navigation.navigate('AdminBookingDetails', { bookingId: booking.id });
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
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
      
      <Text style={{
        fontSize: typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
      }}>
        Customer: {item.customer} • Provider: {item.provider}
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {item.date}
        </Text>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.primary,
        }}>
          ${item.amount}
        </Text>
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
            Bookings Management
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Monitor all platform bookings
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
        />

        {/* Stats */}
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

export default BookingsManagementScreen;
