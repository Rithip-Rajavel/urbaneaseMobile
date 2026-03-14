import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import apiService from '../../services/api';
import { ProviderProfile, User } from '../../types';

const ProviderVerificationScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { providerId } = route.params || { providerId: 1 };
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User not found');
      }
      
      // Load provider data - this would need a dedicated endpoint to get provider profile
      // For now, we'll create a basic structure
      // In a real implementation, you would call something like:
      // const response = await apiService.get(`/api/admin/providers/${providerId}`);
      // setProvider(response.data);
      
      // Placeholder for now
      setProvider(null);
    } catch (error) {
      console.error('Error loading provider data:', error);
      Alert.alert('Error', 'Failed to load provider data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [providerId, user]);

  const handleVerify = async () => {
    if (!provider) return;
    
    Alert.alert(
      'Verify Provider',
      `Are you sure you want to verify this provider?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: async () => {
            try {
              setActionLoading(true);
              await apiService.post(`/api/admin/providers/${providerId}/verify`);
              Alert.alert('Success', 'Provider has been verified successfully.');
              navigation.goBack();
            } catch (error) {
              console.error('Error verifying provider:', error);
              Alert.alert('Error', 'Failed to verify provider. Please try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!provider) return;
    
    Alert.alert(
      'Reject Provider',
      `Are you sure you want to reject this provider?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              setActionLoading(true);
              await apiService.post(`/api/admin/providers/${providerId}/reject`);
              Alert.alert('Rejected', 'Provider verification has been rejected.');
              navigation.goBack();
            } catch (error) {
              console.error('Error rejecting provider:', error);
              Alert.alert('Error', 'Failed to reject provider. Please try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return colors.success;
      case 'PENDING': return colors.warning;
      case 'REJECTED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading provider data...</Text>
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
            Provider Verification
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Review provider application
          </Text>
        </View>

        {/* Status */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.small,
        }}>
          <View style={{
            backgroundColor: getStatusColor(provider?.verificationStatus || 'PENDING'),
            borderRadius: borderRadius.xs,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
            alignSelf: 'flex-start',
            marginBottom: spacing.md,
          }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
            }}>
              {provider?.verificationStatus || 'PENDING'}
            </Text>
          </View>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            {provider?.firstName || ''} {provider?.lastName || ''}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            @{provider?.user?.username || 'unknown'}
          </Text>
        </View>

        {/* Basic Info */}
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
            Basic Information
          </Text>
          
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Contact
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              marginBottom: spacing.xs,
            }}>
              {provider?.user?.email || 'No email'}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {provider?.user?.mobileNumber || 'No phone'}
            </Text>
          </View>
          
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Business Details
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
              marginBottom: spacing.xs,
            }}>
              {provider?.businessName || 'No business name'}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              License: {provider?.businessLicense || 'No license'}
            </Text>
          </View>
          
          <View>
            <Text style={{
              fontSize: typography.caption,
              color: colors.textSecondary,
              marginBottom: spacing.xs,
            }}>
              Experience
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {provider?.yearsOfExperience || 0} years
            </Text>
          </View>
        </View>

        {/* Bio */}
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
            Bio
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.text,
            lineHeight: typography.body * 1.4,
          }}>
            {provider?.bio || 'No bio provided'}
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
            Performance Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.warning,
              }}>
                {provider?.averageRating?.toFixed(1) || '0.0'} ({provider?.totalReviews || 0} reviews)
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Rating
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
                {provider?.totalReviews || 0}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Reviews
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: typography.h3,
                fontWeight: 'bold',
                color: colors.success,
              }}>
                {provider?.completedJobs || 0}
              </Text>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textSecondary,
              }}>
                Completed
              </Text>
            </View>
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
            Services Offered
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            textAlign: 'center',
            paddingVertical: spacing.lg,
          }}>
            Services information will be available once provider profile is fully loaded.
          </Text>
        </View>

        {/* Documents */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.xl,
          ...shadows.small,
        }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Documents
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
            textAlign: 'center',
            paddingVertical: spacing.lg,
          }}>
            Documents will be available once provider profile is fully loaded.
          </Text>
        </View>

        {/* Actions */}
        {provider?.verificationStatus === 'PENDING' && (
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.success,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  flex: 1,
                  marginRight: spacing.sm,
                }}
                onPress={handleVerify}
              >
                <Text style={{
                  fontSize: typography.body,
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  Verify Provider
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: colors.error,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  flex: 1,
                  marginLeft: spacing.sm,
                }}
                onPress={handleReject}
              >
                <Text style={{
                  fontSize: typography.body,
                  color: colors.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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

export default ProviderVerificationScreen;
