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

const RegisterScreen = ({ navigation, route }: any) => {
  const { userType } = route.params || { userType: 'CUSTOMER' };
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      clearError();
    }
  }, [error]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX_PATTERNS.USERNAME.test(formData.username)) {
      newErrors.username = VALIDATION_MESSAGES.USERNAME_INVALID;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX_PATTERNS.EMAIL.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    // Phone validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX_PATTERNS.PHONE.test(formData.mobileNumber)) {
      newErrors.mobileNumber = VALIDATION_MESSAGES.PHONE_INVALID;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX_PATTERNS.PASSWORD.test(formData.password)) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_INVALID;
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
      };

      await register(userData, userType === 'SERVICE_PROVIDER');
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login', { userType }),
          },
        ]
      );
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login', { userType });
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
            paddingBottom: responsiveHeight(20),
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
              Create Account
            </Text>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
            }}>
              {userType === 'CUSTOMER' ? 'Join as a customer to find trusted services' : 'Join as a service provider'}
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: spacing.lg }}>
            {/* Username Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Username
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.username ? colors.error : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.md,
                  fontSize: typography.body,
                  backgroundColor: colors.background,
                }}
                placeholder="Choose a username"
                placeholderTextColor={colors.textLight}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.username && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.username}
                </Text>
              )}
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: spacing.lg }}>
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
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
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

            {/* Mobile Number Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Mobile Number
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.mobileNumber ? colors.error : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.md,
                  fontSize: typography.body,
                  backgroundColor: colors.background,
                }}
                placeholder="Enter your mobile number"
                placeholderTextColor={colors.textLight}
                value={formData.mobileNumber}
                onChangeText={(value) => handleInputChange('mobileNumber', value)}
                keyboardType="phone-pad"
              />
              {errors.mobileNumber && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.mobileNumber}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '500',
                color: colors.text,
                marginBottom: spacing.sm,
              }}>
                Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errors.password ? colors.error : colors.border,
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
                  placeholder="Create a password"
                  placeholderTextColor={colors.textLight}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
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
              {errors.password && (
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.error,
                  marginTop: spacing.xs,
                }}>
                  {errors.password}
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
                Confirm Password
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
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  value={formData.confirmPassword}
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

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
              }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.primary,
                  fontWeight: '600',
                }}>
                  Login
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
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
