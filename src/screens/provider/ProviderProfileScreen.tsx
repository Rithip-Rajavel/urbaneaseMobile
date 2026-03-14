import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import { ProviderProfile, Booking, Review, ProviderService } from '../../types';

interface ProviderData {
  profile: ProviderProfile | null;
  services: ProviderService[];
  stats: {
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalEarnings: number;
    responseTime: string;
    completionRate: number;
  };
}

const ProviderProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [providerData, setProviderData] = useState<ProviderData>({
    profile: null,
    services: [],
    stats: {
      totalBookings: 0,
      completedBookings: 0,
      averageRating: 0,
      totalEarnings: 0,
      responseTime: '0 hours',
      completionRate: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not found');
      }

      // Load provider profile
      // Note: This would need a dedicated API endpoint to get provider profile by user ID
      // For now, we'll construct it from available data
      
      // Load bookings for stats
      const bookingsResponse = await bookingService.getMyBookings();
      const completedBookings = bookingsResponse.filter(b => b.status === 'COMPLETED');
      
      // Load reviews for rating
      let averageRating = 0;
      let totalReviews = 0;
      try {
        const reviewsResponse = await reviewService.getProviderReviews(user.id);
        totalReviews = reviewsResponse.length;
        if (totalReviews > 0) {
          averageRating = reviewsResponse.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
      
      // Calculate stats
      const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      const completionRate = bookingsResponse.length > 0 
        ? (completedBookings.length / bookingsResponse.length) * 100 
        : 0;
      
      // Create a mock provider profile based on user data
      const profile: ProviderProfile = {
        id: user.id,
        user: user,
        firstName: user.username.split('_')[0] || 'First',
        lastName: user.username.split('_')[1] || 'Last',
        bio: 'Professional service provider',
        yearsOfExperience: 3,
        averageRating,
        totalReviews,
        completedJobs: completedBookings.length,
        verificationStatus: 'VERIFIED', // This would come from API
        businessName: `${user.username}'s Services`,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      
      // Mock services - this would come from API
      const services: ProviderService[] = [
        {
          id: 1,
          provider: user,
          service: {
            id: 1,
            name: 'Regular Cleaning',
            description: 'Standard home cleaning service',
            category: { id: 1, name: 'Cleaning', description: '', iconUrl: '', createdAt: '', updatedAt: '', services: [], active: true },
            basePrice: 25,
            estimatedDuration: 2,
            createdAt: '',
            updatedAt: '',
            active: true,
          },
          customPrice: 25,
          description: 'Standard home cleaning service',
          yearsOfExperience: 3,
          createdAt: '',
          updatedAt: '',
          active: true,
        },
        {
          id: 2,
          provider: user,
          service: {
            id: 2,
            name: 'Deep Cleaning',
            description: 'Thorough deep cleaning service',
            category: { id: 1, name: 'Cleaning', description: '', iconUrl: '', createdAt: '', updatedAt: '', services: [], active: true },
            basePrice: 35,
            estimatedDuration: 4,
            createdAt: '',
            updatedAt: '',
            active: true,
          },
          customPrice: 35,
          description: 'Thorough deep cleaning service',
          yearsOfExperience: 3,
          createdAt: '',
          updatedAt: '',
          active: true,
        },
      ];
      
      setProviderData({
        profile,
        services,
        stats: {
          totalBookings: bookingsResponse.length,
          completedBookings: completedBookings.length,
          averageRating,
          totalEarnings,
          responseTime: '2 hours', // This would come from API
          completionRate,
        },
      });
    } catch (error) {
      console.error('Error loading provider data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [user]);

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Edit your professional information and services',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit Profile',
          onPress: () => Alert.alert('Coming Soon', 'Profile editing feature coming soon!'),
        },
      ]
    );
  };

  const toggleServiceStatus = async (service: ProviderService) => {
    Alert.alert(
      'Toggle Service',
      `${service.active ? 'Deactivate' : 'Activate'} ${service.service.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: service.active ? 'Deactivate' : 'Activate',
          onPress: async () => {
            try {
              setActionLoading(service.id);
              // This would need an API endpoint to toggle service status
              // For now, we'll just update the local state
              setProviderData(prev => ({
                ...prev,
                services: prev.services.map(s =>
                  s.id === service.id ? { ...s, active: !s.active } : s
                )
              }));
              Alert.alert('Success', `Service ${service.active ? 'deactivated' : 'activated'} successfully.`);
            } catch (error) {
              console.error('Error toggling service:', error);
              Alert.alert('Error', 'Failed to update service status. Please try again.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      'Settings',
      'Manage your account settings',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settings',
          onPress: () => navigation.navigate('ProviderSettings'),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleViewReviews = () => {
    navigation.navigate('ProviderReviews');
  };

  const ProfileMenuItem = ({ icon, title, onPress, showArrow = true }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: responsiveWidth(24), marginRight: spacing.md }}>
        {icon}
      </Text>
      <Text style={{
        fontSize: typography.body,
        color: colors.text,
        flex: 1,
      }}>
        {title}
      </Text>
      {showArrow && (
        <Text style={{ fontSize: responsiveWidth(20), color: colors.textLight }}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );
  const ServiceItem = ({ item }: { item: ProviderService }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...shadows.small,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.service.name}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          lineHeight: typography.caption * 1.3,
        }}>
          {item.description}
        </Text>
      </View>
      
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{
          fontSize: typography.h3,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.customPrice || item.service.basePrice}/hr
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: item.active ? colors.success : colors.error,
            borderRadius: borderRadius.sm,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            marginLeft: spacing.sm,
            opacity: actionLoading === item.id ? 0.5 : 1,
          }}
          onPress={() => toggleServiceStatus(item)}
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
              {item.active ? 'Active' : 'Inactive'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading profile...</Text>
        </View>
      ) : (
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
            Profile
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage your professional profile
          </Text>
        </View>

        {/* Profile Info Card */}
        {providerData.profile && (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            padding: spacing.lg,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.lg,
            alignItems: 'center',
            ...shadows.small,
          }}>
            <View style={{
              width: responsiveWidth(80),
              height: responsiveWidth(80),
              borderRadius: responsiveWidth(40),
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}>
              <Text style={{ fontSize: responsiveWidth(40) }}>👩‍🔧</Text>
            </View>
            
            <Text style={{
              fontSize: typography.h3,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: spacing.xs,
            }}>
              {providerData.profile.firstName} {providerData.profile.lastName}
            </Text>
            
            <View style={{
              backgroundColor: colors.success,
              borderRadius: borderRadius.xs,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
              alignSelf: 'flex-start',
              marginBottom: spacing.sm,
            }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.background,
                fontWeight: '600',
              }}>
                ✓ Verified
              </Text>
            </View>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: spacing.sm,
            }}>
              {providerData.profile.businessName}
            </Text>
          </View>
        )}

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
            Performance Stats
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
                {providerData.stats.totalBookings}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Total Jobs
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                {providerData.stats.completedBookings}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Completed
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.warning,
              }}>
                ⭐ {providerData.stats.averageRating}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Avg Rating
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.info,
              }}>
                ${providerData.stats.responseTime}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Avg Response
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                {providerData.stats.completionRate}%
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Success Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
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
            Contact Information
          </Text>
          
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Email
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {user?.email || 'No email'}
            </Text>
          </View>
          
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Phone
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {user?.mobileNumber || 'No phone'}
            </Text>
          </View>
        </View>

        {/* Services */}
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
            My Services
          </Text>
          
          {providerData.services.map((service) => (
            <ServiceItem key={service.id} item={service} />
          ))}
        </View>

        {/* Menu Options */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Account Settings
          </Text>
          
          <ProfileMenuItem
            icon="✏️"
            title="Edit Profile"
            onPress={handleEditProfile}
          />
          
          <ProfileMenuItem
            icon="⭐"
            title="My Reviews"
            onPress={handleViewReviews}
          />
          
          <ProfileMenuItem
            icon="⚙️"
            title="Settings"
            onPress={handleSettings}
          />
          
          <ProfileMenuItem
            icon="❓"
            title="Help & Support"
            onPress={() => Alert.alert('Help & Support', 'Help feature coming soon!')}
          />
          
          <ProfileMenuItem
            icon="ℹ️"
            title="About UrbanEase"
            onPress={() => Alert.alert(
              'About UrbanEase',
              'UrbanEase v1.0.0\n\nYour trusted partner for domestic services.\n\n© 2024 UrbanEase Inc.'
            )}
          />
          
          <ProfileMenuItem
            icon="🚪"
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
        </ScrollView>
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

export default ProviderProfileScreen;
