import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockUsers = [
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'CUSTOMER', active: true, joinedDate: '2024-01-15' },
  { id: 2, username: 'sarah_smith', email: 'sarah@example.com', role: 'SERVICE_PROVIDER', active: true, joinedDate: '2024-01-20' },
  { id: 3, username: 'mike_wilson', email: 'mike@example.com', role: 'CUSTOMER', active: false, joinedDate: '2024-02-01' },
  { id: 4, username: 'emma_jones', email: 'emma@example.com', role: 'ADMIN', active: true, joinedDate: '2024-02-10' },
  { id: 5, username: 'alex_brown', email: 'alex@example.com', role: 'SERVICE_PROVIDER', active: true, joinedDate: '2024-02-15' },
];

const UsersManagementScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState(mockUsers);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ALL');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleUserPress = (user: any) => {
    navigation.navigate('UserDetails', { userId: user.id });
  };

  const handleToggleUserStatus = (user: any) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: user.active ? 'Deactivate' : 'Activate',
          onPress: () => {
            setUsers(prevUsers =>
              prevUsers.map(u =>
                u.id === user.id ? { ...u, active: !u.active } : u
              )
            );
          },
        },
      ]
    );
  };

  const handleChangeRole = (user: any) => {
    Alert.alert(
      'Change Role',
      `Select new role for ${user.username}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Customer', onPress: () => updateUserRole(user.id, 'CUSTOMER') },
        { text: 'Provider', onPress: () => updateUserRole(user.id, 'SERVICE_PROVIDER') },
        { text: 'Admin', onPress: () => updateUserRole(user.id, 'ADMIN') },
      ]
    );
  };

  const updateUserRole = (userId: number, newRole: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      )
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return colors.error;
      case 'SERVICE_PROVIDER': return colors.secondary;
      case 'CUSTOMER': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const filteredUsers = selectedRole === 'ALL' 
    ? users 
    : users.filter(user => user.role === selectedRole);

  const renderUserItem = ({ item }: any) => (
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
      onPress={() => handleUserPress(item)}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: responsiveWidth(20),
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20) }}>👤</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '600',
            color: colors.text,
            marginRight: spacing.sm,
          }}>
            {item.username}
          </Text>
          <View style={{
            backgroundColor: getRoleColor(item.role),
            borderRadius: borderRadius.xs,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
          }}>
            <Text style={{
              fontSize: typography.caption,
              color: colors.background,
              fontWeight: '500',
            }}>
              {item.role}
            </Text>
          </View>
        </View>
        
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.email}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: item.active ? colors.success : colors.error,
            marginRight: spacing.xs,
          }} />
          <Text style={{
            fontSize: typography.caption,
            color: colors.textLight,
          }}>
            {item.active ? 'Active' : 'Inactive'} • Joined {item.joinedDate}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={{
          backgroundColor: item.active ? colors.error : colors.success,
          borderRadius: borderRadius.sm,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        }}
        onPress={() => handleToggleUserStatus(item)}
      >
        <Text style={{
          fontSize: typography.caption,
          color: colors.background,
          fontWeight: '600',
        }}>
          {item.active ? 'Deactivate' : 'Activate'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const FilterButton = ({ role, label }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: selectedRole === role ? colors.primary : colors.surface,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: selectedRole === role ? colors.primary : colors.border,
      }}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={{
        fontSize: typography.caption,
        color: selectedRole === role ? colors.background : colors.text,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            Users Management
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Manage all platform users
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
            Filter by Role:
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <FilterButton role="ALL" label="All" />
            <FilterButton role="CUSTOMER" label="Customers" />
            <FilterButton role="SERVICE_PROVIDER" label="Providers" />
            <FilterButton role="ADMIN" label="Admins" />
          </View>
        </View>

        {/* Users List */}
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
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
            Total: {filteredUsers.length} users • 
            Active: {filteredUsers.filter(u => u.active).length} • 
            Inactive: {filteredUsers.filter(u => !u.active).length}
          </Text>
        </View>
      </View>
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

export default UsersManagementScreen;
