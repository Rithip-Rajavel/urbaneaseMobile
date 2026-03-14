import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import { Booking } from '../../types';

const ProviderBookingDetailsScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params || { bookingId: 1 };
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingResponse = await bookingService.getBooking(bookingId);
      setBooking(bookingResponse);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

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

  const handleStartService = async () => {
    if (!booking) return;
    
    Alert.alert(
      'Start Service',
      `Start ${booking.service.name} for ${booking.customer.username}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              setActionLoading(true);
              const updatedBooking = await bookingService.startService(booking.id);
              setBooking(updatedBooking);
              Alert.alert('Started', 'Service has been started.');
            } catch (error) {
              console.error('Error starting service:', error);
              Alert.alert('Error', 'Failed to start service. Please try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCompleteService = async () => {
    if (!booking) return;
    
    Alert.alert(
      'Complete Service',
      `Mark ${booking.service.name} as completed for ${booking.customer.username}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              setActionLoading(true);
              const updatedBooking = await bookingService.completeService(booking.id);
              setBooking(updatedBooking);
              Alert.alert('Completed', 'Service has been marked as completed.');
            } catch (error) {
              console.error('Error completing service:', error);
              Alert.alert('Error', 'Failed to complete service. Please try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleChatWithCustomer = () => {
    if (!booking) return;
    
    navigation.navigate('ProviderChat', {
      conversationId: booking.id,
      userName: booking.customer.username
    });
  };

  const handleCallCustomer = () => {
    if (!booking) return;
    
    Alert.alert(
      'Call Customer',
      `Call ${booking.customer.username} at ${booking.customer.mobileNumber}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Calling', `Dialing ${booking.customer.mobileNumber}...`);
          },
        },
      ]
    );
  };

  const handleGetDirections = () => {
    Alert.alert(
      'Get Directions',
      'Open maps to get directions to the service location?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Open Maps',
          onPress: () => {
            // In a real app, this would open maps app
            Alert.alert('Opening Maps', 'Opening maps to service location...');
          },
        },
      ]
    );
  };

  const canStart = booking?.status === 'ACCEPTED';
  const canComplete = booking?.status === 'IN_PROGRESS';

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading booking details...</Text>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>📋</Text>
        <Text style={{ fontSize: typography.body, color: colors.textSecondary }}>Booking not found</Text>
      </SafeAreaView>
    );
  }

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
            Booking ID: #{booking?.id}
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
            {booking.service.category.name}
          </Text>

          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            ${booking.totalAmount}/hr
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
              <Text style={{ fontSize: responsiveWidth(24) }}>👤</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.text,
                marginBottom: spacing.xs,
              }}>
                {booking.customer.username}
              </Text>

              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              }}>
                {booking.customer.email}
              </Text>

              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                {booking.customer.mobileNumber}
              </Text>
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
              onPress={handleChatWithCustomer}
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
              onPress={handleCallCustomer}
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
            Schedule & Timing
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

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={{ fontSize: responsiveWidth(20), marginRight: spacing.sm }}>📍</Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              flex: 1,
            }}>
              {booking.serviceLocation.address || 'Location not specified'}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.info,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              alignItems: 'center',
            }}
            onPress={handleGetDirections}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              🗺️ Get Directions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        {booking.description && (
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
              Service Description
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

        {/* Notes */}
        {booking.description && (
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
              Customer Notes
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
          {canStart && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.info,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
              onPress={handleStartService}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Start Service
              </Text>
            </TouchableOpacity>
          )}

          {canComplete && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.success,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}
              onPress={handleCompleteService}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.background,
                fontWeight: '600',
              }}>
                Complete Service
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

export default ProviderBookingDetailsScreen;
