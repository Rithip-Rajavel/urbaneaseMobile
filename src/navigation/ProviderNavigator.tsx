import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import provider screens
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import EarningsScreen from '../screens/provider/EarningsScreen';
import ProviderBookingsScreen from '../screens/provider/ProviderBookingsScreen';
import ProviderMessagesScreen from '../screens/provider/ProviderMessagesScreen';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ProviderBookingDetailsScreen from '../screens/provider/ProviderBookingDetailsScreen';
import ProviderChatScreen from '../screens/provider/ProviderChatScreen';
import ProviderReviewsScreen from '../screens/provider/ProviderReviewsScreen';
import ProviderSettingsScreen from '../screens/provider/ProviderSettingsScreen';

// Import theme
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Bookings':
              iconName = 'event';
              break;
            case 'Earnings':
              iconName = 'payments';
              break;
            case 'Messages':
              iconName = 'chat';
              break;
            case 'Profile':
              iconName = 'person';
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
        component={ProviderDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Bookings"
        component={ProviderBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="Messages"
        component={ProviderMessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProviderProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const ProviderNavigator = () => {
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
        name="ProviderTabs"
        component={ProviderTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderBookingDetails"
        component={ProviderBookingDetailsScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen
        name="ProviderChat"
        component={ProviderChatScreen}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name="ProviderReviews"
        component={ProviderReviewsScreen}
        options={{ title: 'Reviews' }}
      />
      <Stack.Screen
        name="ProviderSettings"
        component={ProviderSettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default ProviderNavigator;
