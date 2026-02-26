import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import BookingsManagementScreen from '../screens/admin/BookingsManagementScreen';
import ProvidersVerificationScreen from '../screens/admin/ProvidersVerificationScreen';
import CategoriesManagementScreen from '../screens/admin/CategoriesManagementScreen';
import UserDetailsScreen from '../screens/admin/UserDetailsScreen';
import BookingDetailsScreen from '../screens/admin/BookingDetailsScreen';
import ProviderVerificationScreen from '../screens/admin/ProviderVerificationScreen';
import CategoryFormScreen from '../screens/admin/CategoryFormScreen';

// Import theme
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Users':
              iconName = 'people';
              break;
            case 'Bookings':
              iconName = 'event';
              break;
            case 'Providers':
              iconName = 'verified-user';
              break;
            case 'Categories':
              iconName = 'category';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Users"
        component={UsersManagementScreen}
        options={{ title: 'Users' }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsManagementScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Providers"
        component={ProvidersVerificationScreen}
        options={{ title: 'Providers' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesManagementScreen}
        options={{ title: 'Categories' }}
      />
    </Tab.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{ title: 'User Details' }}
      />
      <Stack.Screen
        name="AdminBookingDetails"
        component={BookingDetailsScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen
        name="ProviderVerification"
        component={ProviderVerificationScreen}
        options={{ title: 'Provider Verification' }}
      />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={{ title: 'Category Form' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
