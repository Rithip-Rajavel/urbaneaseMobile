import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockBooking = {
  id: 1,
  service: 'Home Cleaning',
  provider: { name: 'Sarah Smith', avatar: '👩‍🔧' },
  date: '2024-02-20',
};

const ReviewsScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params || { bookingId: 1 };
  const [booking] = useState(mockBooking);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    if (review.trim() === '') {
      Alert.alert('Comment Required', 'Please write a review comment.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  const renderStar = (index: number) => {
    const filled = index < rating;
    return (
      <TouchableOpacity
        onPress={() => handleRatingPress(index + 1)}
        style={{ marginRight: spacing.xs }}
      >
        <Text style={{ fontSize: responsiveWidth(32) }}>
          {filled ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    );
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
            Leave a Review
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Share your experience
          </Text>
        </View>

        {/* Booking Info */}
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
            marginBottom: spacing.sm,
          }}>
            Service Details
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View style={{
              width: responsiveWidth(40),
              height: responsiveWidth(40),
              borderRadius: borderRadius.md,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.md,
            }}>
              <Text style={{ fontSize: responsiveWidth(20) }}>{booking.provider.avatar}</Text>
            </View>

            <View>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.text,
              }}>
                {booking.service}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                with {booking.provider.name}
              </Text>
            </View>
          </View>

          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            Service date: {booking.date}
          </Text>
        </View>

        {/* Rating Section */}
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
            How was your experience?
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.md }}>
            {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
          </View>

          <Text style={{
            fontSize: typography.caption,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Tap to rate (1-5 stars)
          </Text>
        </View>

        {/* Review Text */}
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
            Write your review
          </Text>

          <View style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            backgroundColor: colors.background,
          }}>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              height: responsiveHeight(120),
              textAlignVertical: 'top',
            }}
              placeholder="Share details about your experience..."
              placeholderTextColor={colors.textLight}
              multiline
              value={review}
              onChangeText={setReview}
            />
          </View>

          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
            marginTop: spacing.sm,
          }}>
            {review.length}/500 characters
          </Text>
        </View>

        {/* Submit Button */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onPress={handleSubmitReview}
            disabled={isSubmitting}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              marginTop: spacing.sm,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              fontWeight: '600',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Review Guidelines */}
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
            Review Guidelines
          </Text>

          <Text style={{
            fontSize: typography.caption,
            color: colors.textSecondary,
            lineHeight: typography.caption * 1.4,
          }}>
            • Be honest and specific in your review{'\n'}
            • Focus on the service quality and professionalism{'\n'}
            • Avoid personal attacks or inappropriate language{'\n'}
            • Your review helps other users make informed decisions
          </Text>
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

export default ReviewsScreen;
