import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import theme
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

const UserSelectionScreen = ({ navigation }: any) => {
  const handleUserTypeSelect = (userType: 'customer' | 'provider') => {
    if (userType === 'customer') {
      navigation.navigate('Login', { userType: 'CUSTOMER' });
    } else {
      navigation.navigate('Login', { userType: 'SERVICE_PROVIDER' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View style={{
          alignItems: 'center',
          paddingTop: responsiveHeight(40),
          paddingBottom: responsiveHeight(30)
        }}>
          <View style={{
            width: responsiveWidth(120),
            height: responsiveWidth(120),
            borderRadius: responsiveWidth(60),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}>
            <Text style={{
              fontSize: responsiveWidth(48),
              color: colors.background,
              fontWeight: 'bold',
            }}>
              UE
            </Text>
          </View>

          <Text style={{
            fontSize: typography.h2,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.sm,
          }}>
            UrbanEase
          </Text>

          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            textAlign: 'center',
            paddingHorizontal: spacing.xl,
            lineHeight: typography.body * 1.4,
          }}>
            Your trusted partner for all domestic services. Connect with verified service providers in your area.
          </Text>
        </View>

        {/* User Type Selection */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: responsiveHeight(40)
        }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.xl,
          }}>
            How would you like to use UrbanEase?
          </Text>

          {/* Customer Option */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: colors.border,
              height: responsiveHeight(200),
            }}
            onPress={() => handleUserTypeSelect('customer')}
            activeOpacity={0.7}
          >
            <View style={{
              width: responsiveWidth(80),
              height: responsiveWidth(80),
              borderRadius: responsiveWidth(40),
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}>
              <Text style={{
                fontSize: responsiveWidth(36),
                color: colors.background,
              }}>
                👤
              </Text>
            </View>

            <Text style={{
              fontSize: typography.h3,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              I'm a Customer
            </Text>

            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: typography.body * 1.4,
            }}>
              Find and book trusted service providers for all your household needs
            </Text>
          </TouchableOpacity>

          {/* Provider Option */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: colors.border,
              height: responsiveHeight(200),
            }}
            onPress={() => handleUserTypeSelect('provider')}
            activeOpacity={0.7}
          >
            <View style={{
              width: responsiveWidth(80),
              height: responsiveWidth(80),
              borderRadius: responsiveWidth(40),
              backgroundColor: colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}>
              <Text style={{
                fontSize: responsiveWidth(36),
                color: colors.background,
              }}>
                🛠️
              </Text>
            </View>

            <Text style={{
              fontSize: typography.h3,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              I'm a Service Provider
            </Text>

            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: typography.body * 1.4,
            }}>
              Offer your services and connect with customers in your area
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{
          alignItems: 'center',
          paddingBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserSelectionScreen;
