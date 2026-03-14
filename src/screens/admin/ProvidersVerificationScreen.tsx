import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import apiService from '../../services/api';
import { ProviderProfile } from '../../types';

const ProvidersVerificationScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error('User not found');
      }
      
      // Load pending provider verifications
      const response = await apiService.get('/api/admin/providers/pending-verification');
      setProviders(response.data as ProviderProfile[]);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProviders();
    setRefreshing(false);
  };

  const handleProviderPress = (provider: any) => {
    navigation.navigate('ProviderVerification', { providerId: provider.id });
  };

  const handleVerifyProvider = async (provider: ProviderProfile) => {
    Alert.alert(
      'Verify Provider',
      `Are you sure you want to verify ${provider.user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: async () => {
            try {
              await apiService.post(`/api/admin/providers/${provider.id}/verify`);
              
              // Update local state
              setProviders(prevProviders =>
                prevProviders.map(p =>
                  p.id === provider.id ? { ...p, verificationStatus: 'VERIFIED' } : p
                )
              );
              
              Alert.alert('Success', 'Provider verified successfully!');
            } catch (error) {
              console.error('Error verifying provider:', error);
              Alert.alert('Error', 'Failed to verify provider. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRejectProvider = async (provider: ProviderProfile) => {
    Alert.alert(
      'Reject Provider',
      `Are you sure you want to reject ${provider.user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              await apiService.post(`/api/admin/providers/${provider.id}/reject`);
              
              // Update local state
              setProviders(prevProviders =>
                prevProviders.map(p =>
                  p.id === provider.id ? { ...p, verificationStatus: 'REJECTED' } : p
                )
              );
              
              Alert.alert('Success', 'Provider rejected successfully!');
            } catch (error) {
              console.error('Error rejecting provider:', error);
              Alert.alert('Error', 'Failed to reject provider. Please try again.');
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

  const filteredProviders = providers.filter(provider => provider.status === selectedStatus);

  const renderProviderItem = ({ item }: { item: ProviderProfile }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows.small,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
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
            marginBottom: spacing.xs,
          }}>
            {item.service} • {item.experience} years experience
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Text style={{ fontSize: responsiveWidth(14), color: colors.warning, marginRight: spacing.xs }}>
              ⭐
            </Text>
            <Text style={{
              fontSize: typography.caption,
              color: colors.text,
              fontWeight: '500',
            }}>
              {item.rating}
            </Text>
          </View>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            Applied: {item.appliedDate}
          </Text>
        </View>
        <View style={{
          backgroundColor: getStatusColor(item.status),
          borderRadius: borderRadius.xs,
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.background,
            fontWeight: '500',
          }}>
            {item.status}
          </Text>
        </View>
      </View>
      
      {item.status === 'PENDING' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.success,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              flex: 1,
              marginRight: spacing.sm,
            }}
            onPress={() => handleVerifyProvider(item)}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Verify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.error,
              borderRadius: borderRadius.sm,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              flex: 1,
            }}
            onPress={() => handleRejectProvider(item)}
          >
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const FilterButton = ({ status, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedStatus === status ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: selectedStatus === status ? colors.primary : colors.border,
      }}
      onPress={() => setSelectedStatus(status)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: selectedStatus === status ? colors.background : colors.text,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading providers...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
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
            Review and verify service providers
          </Text>
        </View>

        {/* Filters */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '500',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            Filter by Status:
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <FilterButton status="PENDING" label="Pending" />
            <FilterButton status="VERIFIED" label="Verified" />
            <FilterButton status="REJECTED" label="Rejected" />
          </View>
        </View>

        {/* Providers List */}
        <FlatList
          data={filteredProviders}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Stats */}
        <View style={{
          backgroundColor: colors.surface,
          padding: spacing.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <Text style={{
            fontSize: typography.caption,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Pending: {providers.filter(p => p.status === 'PENDING').length} • 
            Verified: {providers.filter(p => p.status === 'VERIFIED').length} • 
            Rejected: {providers.filter(p => p.status === 'REJECTED').length}
          </Text>
        </View>
      </View>
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

export default ProvidersVerificationScreen;
