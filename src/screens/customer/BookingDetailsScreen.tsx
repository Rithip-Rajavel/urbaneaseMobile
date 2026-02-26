import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockBooking = {
  id: 1,
  service: { name: 'Home Cleaning', category: 'Cleaning', price: 25 },
  provider: { 
    name: 'Sarah Smith', 
    email: 'sarah@example.com', 
    phone: '+1234567890',
    rating: 4.8,
    reviews: 127,
    avatar: '👩‍🔧'
  },
  status: 'ACCEPTED',
  scheduledTime: '2024-02-22 10:00 AM',
  totalAmount: 25,
  description: 'Regular home cleaning service',
  location: { address: '123 Main St, City, State', latitude: 40.7128, longitude: -74.0060 },
  createdAt: '2024-02-20',
};

const BookingDetailsScreen = ({ route, navigation }: any) => {
  const { bookingId, providerId } = route.params || { bookingId: 1, providerId: null };
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

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          onPress: () => {
            setBooking(prev => ({ ...prev, status: 'CANCELLED' }));
            Alert.alert('Success', 'Booking has been cancelled.');
          },
        },
      ]
    );
  };

  const handleChatWithProvider = () => {
    navigation.navigate('Chat', { 
      providerId: booking.provider.name, 
      userName: booking.provider.name 
    });
  };

  const handleCallProvider = () => {
    Alert.alert(
      'Call Provider',
      `Call ${booking.provider.name} at ${booking.provider.phone}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Calling', `Dialing ${booking.provider.phone}...`);
          },
        },
      ]
    );
  };

  const canCancel = booking.status === 'PENDING' || booking.status === 'ACCEPTED';
  const canReview = booking.status === 'COMPLETED';

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
              {getStatusText(booking.status)}
            </Text>
          </View>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            {booking.service.name}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }}>
            {booking.service.category}
          </Text>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            ${booking.totalAmount}/hr
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
            Service Provider
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <View style={{
              width: responsiveWidth(50),
              height: responsiveWidth(50),
              borderRadius: borderRadius.md,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.md,
            }}>
              <Text style={{ fontSize: responsiveWidth(24) }}>{booking.provider.avatar}</Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                {booking.provider.name}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
                  ⭐
                </Text>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.text,
                  fontWeight: '500',
                }}>
                  {booking.provider.rating}
                </Text>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.textLight,
                  marginLeft: spacing.xs,
                }}>
                  ({booking.provider.reviews} reviews)
                </Text>
              </View>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                flex: 1,
                marginRight: spacing.sm,
              }}
              onPress={handleChatWithProvider}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                💬 Chat
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.success,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                flex: 1,
                marginLeft: spacing.sm,
              }}
              onPress={handleCallProvider}
            >
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                📞 Call
              </Text>
            </TouchableOpacity>
          </View>
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
            Schedule
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.sm }}>📅</Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {booking.scheduledTime}
            </Text>
          </View>
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
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.sm }}>📍</Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              flex: 1,
            }}>
              {booking.location.address}
            </Text>
          </View>
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

        {/* Actions */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          {canCancel && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.error,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
              onPress={handleCancelBooking}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}
          
          {canReview && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Reviews', { bookingId: booking.id })}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Leave a Review
              </Text>
            </TouchableOpacity>
          )}
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

export default BookingDetailsScreen;
