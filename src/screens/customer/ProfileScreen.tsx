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
const mockUserData = {
  username: 'john_doe',
  email: 'john@example.com',
  mobileNumber: '+1234567890',
  fullName: 'John Doe',
  address: '123 Main St, City, State',
  joinDate: 'January 15, 2024',
  totalBookings: 15,
  completedBookings: 12,
  averageRating: 4.8,
};

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, updateUser } = useAuth();
  const [userData, setUserData] = useState(mockUserData);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  const handleSettings = () => {
    // Navigate to settings screen
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  const handleHelp = () => {
    // Navigate to help screen
    Alert.alert('Help & Support', 'Help feature coming soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About UrbanEase',
      'UrbanEase v1.0.0\n\nYour trusted partner for domestic services.\n\n© 2024 UrbanEase Inc.'
    );
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
            Manage your account settings
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
            <Text style={{ fontSize: responsiveWidth(40) }}>👤</Text>
          </View>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.xs,
          }}>
            {userData.fullName}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
          }}>
            @{userData.username}
          </Text>
          
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            Member since {userData.joinDate}
          </Text>
        </View>

        {/* Statistics */}
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
            Your Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
                {userData.totalBookings}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Total Bookings
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                {userData.completedBookings}
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
                ⭐ {userData.averageRating}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Avg Rating
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
              {userData.email}
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
              {userData.mobileNumber}
            </Text>
          </View>
          
          <View>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Address
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {userData.address}
            </Text>
          </View>
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
            icon="⚙️"
            title="Settings"
            onPress={handleSettings}
          />
          
          <ProfileMenuItem
            icon="❓"
            title="Help & Support"
            onPress={handleHelp}
          />
          
          <ProfileMenuItem
            icon="ℹ️"
            title="About UrbanEase"
            onPress={handleAbout}
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

export default ProfileScreen;
