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
import reviewService from '../../services/reviewService';
import { Review } from '../../types';

const ProviderReviewsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User not found');
      }
      const reviewsResponse = await reviewService.getProviderReviews(user.id);
      setReviews(reviewsResponse);
    } catch (error) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={{
              fontSize: responsiveWidth(16),
              marginRight: spacing.xs,
            }}
          >
            {star <= rating ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.small,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <View style={{
          width: responsiveWidth(40),
          height: responsiveWidth(40),
          borderRadius: borderRadius.md,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
          <Text style={{ fontSize: responsiveWidth(20) }}>👤</Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {item.customer.username}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderStars(item.rating)}
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              marginLeft: spacing.sm,
            }}>
              {formatReviewDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ marginBottom: spacing.sm }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          Service: {item.booking?.service?.name || 'Service not specified'}
        </Text>
      </View>
      
      <Text style={{
        fontSize: typography.body,
        color: colors.text,
        lineHeight: typography.body * 1.4,
      }}>
        {item.comment || 'No comment provided'}
      </Text>
    </View>
  );

  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => 
      reviews.filter(review => review.rating === rating).length
    );

    return { totalReviews, averageRating, ratingCounts };
  };

  const { totalReviews, averageRating, ratingCounts } = calculateStats();

  const filteredReviews = selectedRating === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(selectedRating));

  const RatingBar = ({ rating, count, percentage }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
      <View style={{ width: responsiveWidth(60) }}>
        <Text style={{
          fontSize: typography.caption,
          color: colors.text,
          textAlign: 'right',
          marginRight: spacing.md,
        }}>
          {rating} ⭐
        </Text>
      </View>
      
      <View style={{
        flex: 1,
        height: responsiveHeight(8),
        backgroundColor: colors.border,
        borderRadius: responsiveHeight(4),
        marginRight: spacing.md,
        overflow: 'hidden',
      }}>
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: colors.warning,
            borderRadius: responsiveHeight(4),
          }}
        />
      </View>
      
      <Text style={{
        fontSize: typography.caption,
        color: colors.text,
        width: responsiveWidth(40),
      }}>
        {count}
      </Text>
    </View>
  );

  const FilterButton = ({ rating, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedRating === rating ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: selectedRating === rating ? colors.primary : colors.border,
      }}
      onPress={() => setSelectedRating(rating)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: selectedRating === rating ? colors.background : colors.text,
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
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading reviews...</Text>
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
            My Reviews
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Customer feedback and ratings
          </Text>
        </View>

        {/* Stats Overview */}
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
            Rating Overview
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{
              fontSize: typography.h2,
              fontWeight: 'bold',
              color: colors.warning,
              marginRight: spacing.md,
            }}>
              ⭐ {averageRating.toFixed(1)}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
            }}>
              ({totalReviews} reviews)
            </Text>
          </View>
          
          <View>
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={ratingCounts[index]}
                percentage={totalReviews > 0 ? (ratingCounts[index] / totalReviews) * 100 : 0}
              />
            ))}
          </View>
        </View>

        {/* Filter Options */}
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
            Filter by Rating:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <FilterButton rating="all" label="All" />
            <FilterButton rating="5" label="5 Stars" />
            <FilterButton rating="4" label="4 Stars" />
            <FilterButton rating="3" label="3 Stars" />
            <FilterButton rating="2" label="2 Stars" />
            <FilterButton rating="1" label="1 Star" />
          </View>
        </View>

        {/* Reviews List */}
        <FlatList
          data={filteredReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={{ fontSize: responsiveWidth(40), marginBottom: spacing.md }}>⭐</Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}>
                No reviews found
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
            {filteredReviews.length} reviews • 
            Average rating: {averageRating.toFixed(1)} stars
          </Text>
        </View>
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

export default ProviderReviewsScreen;
