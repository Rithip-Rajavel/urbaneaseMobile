import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockSettings = {
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    bookingAlerts: true,
    messageAlerts: true,
    reviewAlerts: true,
    earningsAlerts: true,
  },
  privacy: {
    showPhoneNumber: true,
    showEmail: false,
    showLocation: true,
    allowDirectMessages: true,
  },
  availability: {
    autoAcceptBookings: false,
    workingHours: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    maxDistance: 25, // km
  },
  account: {
    twoFactorAuth: false,
    emailVerified: true,
    phoneVerified: true,
    profileVerified: true,
  },
};

const ProviderSettingsScreen = ({ navigation }: any) => {
  const [settings, setSettings] = useState(mockSettings);

  const handleToggleSetting = (category: string, setting: string) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (category === 'notifications') {
        newSettings.notifications = {
          ...prev.notifications,
          [setting]: !prev.notifications[setting as keyof typeof prev.notifications],
        };
      } else if (category === 'privacy') {
        newSettings.privacy = {
          ...prev.privacy,
          [setting]: !prev.privacy[setting as keyof typeof prev.privacy],
        };
      } else if (category === 'availability') {
        newSettings.availability = {
          ...prev.availability,
          [setting]: !prev.availability[setting as keyof typeof prev.availability],
        };
      } else if (category === 'account') {
        newSettings.account = {
          ...prev.account,
          [setting]: !prev.account[setting as keyof typeof prev.account],
        };
      }
      return newSettings;
    });
  };

  const handleWorkingHoursToggle = (day: keyof typeof settings.availability.workingHours) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingHours: {
          ...prev.availability.workingHours,
          [day]: !prev.availability.workingHours[day as keyof typeof prev.availability.workingHours],
        },
      },
    }));
  };

  const handleMaxDistanceChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        maxDistance: value,
      },
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            // In a real app, this would call logout function
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const SettingsItem = ({ title, subtitle, value, onToggle, type = 'toggle' }: any) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.small,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '500',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: typography.caption,
            color: colors.textSecondary,
          }}>
            {subtitle}
          </Text>
        )}
      </View>

      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      )}

      {type === 'action' && (
        <TouchableOpacity onPress={onToggle}>
          <Text style={{
            fontSize: typography.body,
            color: colors.primary,
            fontWeight: '500',
          }}>
            {value}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const DayToggle = ({ day, enabled }: any) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}>
      <Text style={{
        fontSize: typography.body,
        color: colors.text,
        textTransform: 'capitalize',
      }}>
        {day}
      </Text>
      <Switch
        value={enabled}
        onValueChange={() => handleWorkingHoursToggle(day)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.background}
      />
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
            Settings
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage your account preferences
          </Text>
        </View>

        {/* Notifications */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Notifications
          </Text>

          <SettingsItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={settings.notifications.pushNotifications}
            onToggle={() => handleToggleSetting('notifications', 'pushNotifications')}
          />

          <SettingsItem
            title="Email Notifications"
            subtitle="Receive email updates"
            value={settings.notifications.emailNotifications}
            onToggle={() => handleToggleSetting('notifications', 'emailNotifications')}
          />

          <SettingsItem
            title="Booking Alerts"
            subtitle="Get notified about new bookings"
            value={settings.notifications.bookingAlerts}
            onToggle={() => handleToggleSetting('notifications', 'bookingAlerts')}
          />

          <SettingsItem
            title="Message Alerts"
            subtitle="Get notified about new messages"
            value={settings.notifications.messageAlerts}
            onToggle={() => handleToggleSetting('notifications', 'messageAlerts')}
          />

          <SettingsItem
            title="Review Alerts"
            subtitle="Get notified about new reviews"
            value={settings.notifications.reviewAlerts}
            onToggle={() => handleToggleSetting('notifications', 'reviewAlerts')}
          />

          <SettingsItem
            title="Earnings Alerts"
            subtitle="Get notified about earnings updates"
            value={settings.notifications.earningsAlerts}
            onToggle={() => handleToggleSetting('notifications', 'earningsAlerts')}
          />
        </View>

        {/* Privacy */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Privacy
          </Text>

          <SettingsItem
            title="Show Phone Number"
            subtitle="Display your phone number to customers"
            value={settings.privacy.showPhoneNumber}
            onToggle={() => handleToggleSetting('privacy', 'showPhoneNumber')}
          />

          <SettingsItem
            title="Show Email"
            subtitle="Display your email to customers"
            value={settings.privacy.showEmail}
            onToggle={() => handleToggleSetting('privacy', 'showEmail')}
          />

          <SettingsItem
            title="Show Location"
            subtitle="Display your general location area"
            value={settings.privacy.showLocation}
            onToggle={() => handleToggleSetting('privacy', 'showLocation')}
          />

          <SettingsItem
            title="Allow Direct Messages"
            subtitle="Let customers message you directly"
            value={settings.privacy.allowDirectMessages}
            onToggle={() => handleToggleSetting('privacy', 'allowDirectMessages')}
          />
        </View>

        {/* Availability */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Availability
          </Text>

          <SettingsItem
            title="Auto-Accept Bookings"
            subtitle="Automatically accept booking requests"
            value={settings.availability.autoAcceptBookings}
            onToggle={() => handleToggleSetting('availability', 'autoAcceptBookings')}
          />

          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            ...shadows.small,
          }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.md,
            }}>
              Working Hours
            </Text>

            <DayToggle day="monday" enabled={settings.availability.workingHours.monday} />
            <DayToggle day="tuesday" enabled={settings.availability.workingHours.tuesday} />
            <DayToggle day="wednesday" enabled={settings.availability.workingHours.wednesday} />
            <DayToggle day="thursday" enabled={settings.availability.workingHours.thursday} />
            <DayToggle day="friday" enabled={settings.availability.workingHours.friday} />
            <DayToggle day="saturday" enabled={settings.availability.workingHours.saturday} />
            <DayToggle day="sunday" enabled={settings.availability.workingHours.sunday} />
          </View>

          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            ...shadows.small,
          }}>
            <Text style={{
              fontSize: typography.body,
              fontWeight: '500',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Maximum Service Distance
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.primary,
            }}>
              {settings.availability.maxDistance} km
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
            }}>
              Maximum distance you're willing to travel for services
            </Text>
          </View>
        </View>

        {/* Account */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Account
          </Text>

          <SettingsItem
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            value={settings.account.twoFactorAuth}
            onToggle={() => handleToggleSetting('account', 'twoFactorAuth')}
          />

          <SettingsItem
            title="Email Verification"
            subtitle="Your email is verified"
            value={settings.account.emailVerified ? "Verified" : "Not Verified"}
            onToggle={() => { }}
            type="action"
          />

          <SettingsItem
            title="Phone Verification"
            subtitle="Your phone number is verified"
            value={settings.account.phoneVerified ? "Verified" : "Not Verified"}
            onToggle={() => { }}
            type="action"
          />

          <SettingsItem
            title="Profile Verification"
            subtitle="Your profile is verified"
            value={settings.account.profileVerified ? "Verified" : "Not Verified"}
            onToggle={() => { }}
            type="action"
          />
        </View>

        {/* Danger Zone */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.error,
            marginBottom: spacing.md,
          }}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border,
              ...shadows.small,
            }}
            onPress={handleLogout}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.error,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              ...shadows.small,
            }}
            onPress={handleDeleteAccount}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Delete Account
            </Text>
          </TouchableOpacity>
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

export default ProviderSettingsScreen;
