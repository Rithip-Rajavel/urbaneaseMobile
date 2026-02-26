import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockProviderData = {
  user: { username: 'sarah_smith', email: 'sarah@example.com', phone: '+1234567890' },
  profile: {
    firstName: 'Sarah',
    lastName: 'Smith',
    bio: 'Experienced cleaning professional with 5+ years in residential and commercial cleaning.',
    profileImageUrl: null,
    yearsOfExperience: 5,
    averageRating: 4.8,
    totalReviews: 127,
    completedJobs: 156,
    verificationStatus: 'VERIFIED',
    businessName: 'Sarah\'s Cleaning Services',
    businessLicense: 'CLN-2024-001',
  },
  services: [
    { id: 1, name: 'Regular Cleaning', price: 25, description: 'Standard home cleaning service', active: true },
    { id: 2, name: 'Deep Cleaning', price: 35, description: 'Thorough deep cleaning service', active: true },
    { id: 3, name: 'Office Cleaning', price: 30, description: 'Professional office cleaning', active: true },
    { id: 4, name: 'Post-Construction Cleaning', price: 40, description: 'Cleaning after construction work', active: false },
  ],
  stats: {
    totalBookings: 156,
    completedBookings: 127,
    averageRating: 4.8,
    totalEarnings: 3456.78,
    responseTime: '2 hours',
    completionRate: 95,
  },
};

const ProviderProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [providerData, setProviderData] = useState(mockProviderData);

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

  const ServiceItem = ({ item }: any) => (
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
          {item.name}
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
          ${item.price}/hr
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: item.active ? colors.success : colors.error,
            borderRadius: borderRadius.sm,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            marginLeft: spacing.sm,
          }}
          onPress={() => {
            Alert.alert(
              'Toggle Service',
              `${item.active ? 'Deactivate' : 'Activate'} ${item.name}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: item.active ? 'Deactivate' : 'Activate',
                  onPress: () => {
                    setProviderData(prev => ({
                      ...prev,
                      services: prev.services.map(s =>
                        s.id === item.id ? { ...s, active: !s.active } : s
                      )
                    }));
                  },
                },
              ]
            );
          }}
        >
          <Text style={{
            fontSize: typography.caption,
            color: colors.background,
            fontWeight: '600',
          }}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
              {providerData.user.email}
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
              {providerData.user.phone}
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
