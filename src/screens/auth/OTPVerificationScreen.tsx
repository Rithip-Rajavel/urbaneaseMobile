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
import { VALIDATION_MESSAGES } from '../../constants';

const OTPVerificationScreen = ({ navigation, route }: any) => {
  const { email } = route.params || { email: '' };
  const { verifyOtpAndResetPassword, isLoading, error, clearError } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // OTP validation
    if (!otp.trim()) {
      newErrors.otp = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be exactly 6 digits';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must contain only digits';
    }

    // Password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'otp':
        // Only allow digits and limit to 6 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setOtp(numericValue);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleVerifyAndReset = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await verifyOtpAndResetPassword(email, otp, newPassword);
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please login with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
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

  const resendOTP = () => {
    navigation.navigate('ForgotPassword');
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
              Verify & Reset
            </Text>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
              lineHeight: typography.body * 1.4,
            }}>
              Enter the verification code sent to your email and set a new password.
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: spacing.lg }}>
            {/* Email Display */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
            }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              }}>
                Email Address
              </Text>
              <Text style={{
                fontSize: typography.body,
                color: colors.text,
                fontWeight: '500',
              }}>
                {email}
              </Text>
            </View>

            {/* OTP Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Verification Code
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.otp ? colors.error : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.md,
                  fontSize: responsiveWidth(20),
                  backgroundColor: colors.background,
                  textAlign: 'center',
                  letterSpacing: responsiveWidth(8),
                }}
                placeholder="000000"
                placeholderTextColor={colors.textLight}
                value={otp}
                onChangeText={(value) => handleInputChange('otp', value)}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.otp && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.otp}
                </Text>
              )}
            </View>

            {/* New Password Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                New Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errors.newPassword ? colors.error : colors.border,
                borderRadius: borderRadius.md,
                backgroundColor: colors.background,
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.md,
                    fontSize: typography.body,
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textLight}
                  value={newPassword}
                  onChangeText={(value) => handleInputChange('newPassword', value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ paddingHorizontal: spacing.md }}
                >
                  <Text style={{ color: colors.primary, fontSize: responsiveWidth(20) }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.newPassword}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Confirm New Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errors.confirmPassword ? colors.error : colors.border,
                borderRadius: borderRadius.md,
                backgroundColor: colors.background,
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.md,
                    fontSize: typography.body,
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textLight}
                  value={confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ paddingHorizontal: spacing.md }}
                >
                  <Text style={{ color: colors.primary, fontSize: responsiveWidth(20) }}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Verify & Reset Button */}
            <TouchableOpacity
              onPress={handleVerifyAndReset}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.lg,
                opacity: isLoading ? 0.7 : 1,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.background,
              }}>
                {isLoading ? 'Verifying...' : 'Verify & Reset Password'}
              </Text>
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
                marginBottom: spacing.sm,
              }}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity onPress={resendOTP}>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.primary,
                  fontWeight: '600',
                }}>
                  Resend Code
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
              The verification code will expire in 10 minutes for security reasons.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;
