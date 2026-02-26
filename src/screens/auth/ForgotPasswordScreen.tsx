import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import { REGEX_PATTERNS, VALIDATION_MESSAGES } from '../../constants';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX_PATTERNS.EMAIL.test(email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) {
      return;
    }

    try {
      await forgotPassword(email);
      
      Alert.alert(
        'OTP Sent',
        'A verification code has been sent to your email. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OTPVerification', { email }),
          },
        ]
      );
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={{
            paddingTop: responsiveHeight(20),
            paddingBottom: responsiveHeight(30),
            paddingHorizontal: spacing.lg,
          }}>
            <TouchableOpacity onPress={goBack} style={{ marginBottom: spacing.lg }}>
              <Text style={{ fontSize: responsiveWidth(24), color: colors.primary }}>
                ←
              </Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: typography.h2,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: spacing.sm,
            }}>
              Forgot Password
            </Text>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              lineHeight: typography.body * 1.4,
            }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: spacing.lg }}>
            {/* Email Input */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Email Address
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? colors.error : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.md,
                  fontSize: typography.body,
                  backgroundColor: colors.background,
                }}
                placeholder="Enter your registered email"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.xl,
                opacity: isLoading ? 0.7 : 1,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.background,
              }}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>

            {/* Instructions */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Instructions:
              </Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                lineHeight: typography.body * 1.5,
              }}>
                1. Enter your registered email address{'\n'}
                2. We'll send a 6-digit verification code{'\n'}
                3. Use the code to reset your password{'\n'}
                4. The code will expire in 10 minutes
              </Text>
            </View>

            {/* Back to Login */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={goBack}>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.primary,
                  fontWeight: '600',
                }}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: spacing.lg,
            paddingHorizontal: spacing.lg,
          }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textLight,
              textAlign: 'center',
            }}>
              If you don't receive the email within a few minutes, please check your spam folder.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
