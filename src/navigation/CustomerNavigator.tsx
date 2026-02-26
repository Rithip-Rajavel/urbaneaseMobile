import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import customer screens
import HomeScreen from '../screens/customer/HomeScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import BookingsScreen from '../screens/customer/BookingsScreen';
import MessagesScreen from '../screens/customer/MessagesScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import ServiceProvidersScreen from '../screens/customer/ServiceProvidersScreen';
import BookingDetailsScreen from '../screens/customer/BookingDetailsScreen';
import ChatScreen from '../screens/customer/ChatScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import ReviewsScreen from '../screens/customer/ReviewsScreen';

// Import theme
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Categories':
              iconName = 'category';
              break;
            case 'Bookings':
              iconName = 'event';
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
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: 'My Bookings' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const CustomerNavigator = () => {
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
        name="CustomerTabs"
        component={CustomerTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceProviders"
        component={ServiceProvidersScreen}
        options={{ title: 'Service Providers' }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ title: 'Reviews' }}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigator;
