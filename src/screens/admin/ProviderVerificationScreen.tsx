import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockProvider = {
  id: 1,
  user: { username: 'john_smith', email: 'john@example.com', phone: '+1234567890' },
  firstName: 'John',
  lastName: 'Smith',
  bio: 'Experienced cleaning professional with 5+ years in residential and commercial cleaning.',
  profileImageUrl: null,
  yearsOfExperience: 5,
  averageRating: 4.8,
  totalReviews: 127,
  completedJobs: 156,
  verificationStatus: 'PENDING',
  businessName: 'John\'s Cleaning Services',
  businessLicense: 'CLN-2024-001',
  services: [
    { name: 'Home Cleaning', price: 25, description: 'Complete home cleaning service' },
    { name: 'Office Cleaning', price: 35, description: 'Professional office cleaning' },
    { name: 'Deep Cleaning', price: 45, description: 'Thorough deep cleaning service' },
  ],
  documents: [
    { type: 'Business License', url: '#', status: 'verified' },
    { type: 'ID Proof', url: '#', status: 'verified' },
    { type: 'Address Proof', url: '#', status: 'pending' },
  ],
};

const ProviderVerificationScreen = ({ route, navigation }: any) => {
  const { providerId } = route.params || { providerId: 1 };
  const [provider, setProvider] = useState(mockProvider);

  const handleVerify = () => {
    Alert.alert(
      'Verify Provider',
      `Are you sure you want to verify ${provider.firstName} ${provider.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: () => {
            setProvider(prev => ({ ...prev, verificationStatus: 'VERIFIED' }));
            Alert.alert('Success', 'Provider has been verified successfully.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Provider',
      `Are you sure you want to reject ${provider.firstName} ${provider.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: () => {
            setProvider(prev => ({ ...prev, verificationStatus: 'REJECTED' }));
            Alert.alert('Rejected', 'Provider verification has been rejected.');
            navigation.goBack();
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
            backgroundColor: getStatusColor(provider.verificationStatus),
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
              {provider.verificationStatus}
            </Text>
          </View>
          
          <Text style={{
            fontSize: typography.h3,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            {provider.firstName} {provider.lastName}
          </Text>
          
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            @{provider.user.username}
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
              {provider.user.email}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              {provider.user.phone}
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
              {provider.businessName}
            </Text>
            <Text style={{
              fontSize: typography.body,
              color: colors.text,
            }}>
              License: {provider.businessLicense}
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
              {provider.yearsOfExperience} years
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
            {provider.bio}
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
                ⭐ {provider.averageRating}
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
                {provider.totalReviews}
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
                {provider.completedJobs}
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
          
          {provider.services.map((service, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: spacing.sm,
              borderBottomWidth: index < provider.services.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: typography.body,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}>
                  {service.name}
                </Text>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.textSecondary,
                }}>
                  {service.description}
                </Text>
              </View>
              <Text style={{
                fontSize: typography.body,
                fontWeight: '600',
                color: colors.primary,
              }}>
                ${service.price}/hr
              </Text>
            </View>
          ))}
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
          
          {provider.documents.map((doc, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: spacing.sm,
              borderBottomWidth: index < provider.documents.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}>
              <Text style={{
                fontSize: typography.body,
                color: colors.text,
              }}>
                {doc.type}
              </Text>
              <View style={{
                backgroundColor: doc.status === 'verified' ? colors.success : colors.warning,
                borderRadius: borderRadius.xs,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
              }}>
                <Text style={{
                  fontSize: typography.caption,
                  color: colors.background,
                  fontWeight: '500',
                }}>
                  {doc.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        {provider.verificationStatus === 'PENDING' && (
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
