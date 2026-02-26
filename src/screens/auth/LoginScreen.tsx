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

const LoginScreen = ({ navigation, route }: any) => {
  const { userType } = route.params || { userType: 'CUSTOMER' };
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      clearError();
    }
  }, [error]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(formData.username, formData.password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register', { userType });
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
              Welcome Back
            </Text>
            
            <Text style={{
              fontSize: typography.body,
              color: colors.textSecondary,
            }}>
              {userType === 'CUSTOMER' ? 'Login to find trusted service providers' : 'Login to manage your services'}
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
                Username or Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.md,
                  fontSize: typography.body,
                  backgroundColor: colors.background,
                }}
                placeholder="Enter your username or email"
                placeholderTextColor={colors.textLight}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: spacing.xl }}>
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
                borderColor: colors.border,
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
                  placeholder="Enter your password"
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={navigateToForgotPassword}
              style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}
            >
              <Text style={{
                fontSize: typography.body,
                color: colors.primary,
                fontWeight: '500',
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
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
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.body,
                color: colors.textSecondary,
              }}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.primary,
                  fontWeight: '600',
                }}>
                  Register
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
              By logging in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
