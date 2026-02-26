import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockBooking = {
  id: 1,
  customer: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  provider: { name: 'Sarah Smith', email: 'sarah@example.com', phone: '+0987654321' },
  service: { name: 'Home Cleaning', category: 'Cleaning', price: 45 },
  status: 'COMPLETED',
  scheduledTime: '2024-02-20 10:00 AM',
  startTime: '2024-02-20 10:15 AM',
  endTime: '2024-02-20 12:30 PM',
  totalAmount: 45,
  description: 'Deep cleaning of 2-bedroom apartment',
  createdAt: '2024-02-19',
  location: { address: '123 Main St, City, State', latitude: 40.7128, longitude: -74.0060 },
};

const BookingDetailsScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params || { bookingId: 1 };
  const [booking, setBooking] = useState(mockBooking);

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
            Booking Details
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Booking ID: #{booking.id}
          </Text>
        </View>

        {/* Status Card */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.small,
        }}>
          <View style={{
            backgroundColor: getStatusColor(booking.status),
            borderRadius: borderRadius.xs,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
            alignSelf: 'flex-start',
            marginBottom: spacing.md,
          }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              {booking.status}
            </Text>
          </View>
          
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            {booking.service.name}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            {booking.service.category}
          </Text>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            ${booking.totalAmount}
          </Text>
        </View>

        {/* Customer Info */}
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
            Customer Information
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {booking.customer.name}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            {booking.customer.email}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            {booking.customer.phone}
          </Text>
        </View>

        {/* Provider Info */}
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
            Provider Information
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {booking.provider.name}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            {booking.provider.email}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            {booking.provider.phone}
          </Text>
        </View>

        {/* Timing Details */}
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
            Timing Details
          </Text>
          
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Scheduled
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {booking.scheduledTime}
            </Text>
          </View>
          
          {booking.startTime && (
            <View style={{ marginBottom: spacing.sm }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              }}>
                Started
              </Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.text,
              }}>
                {booking.startTime}
              </Text>
            </View>
          )}
          
          {booking.endTime && (
            <View>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              }}>
                Ended
              </Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.text,
              }}>
                {booking.endTime}
              </Text>
            </View>
          )}
        </View>

        {/* Location */}
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
            Service Location
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.text,
          }}>
            {booking.location.address}
          </Text>
        </View>

        {/* Description */}
        {booking.description && (
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
              Description
            </Text>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              lineHeight: typography.body * 1.4,
            }}>
              {booking.description}
            </Text>
          </View>
        )}
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

export default BookingDetailsScreen;
