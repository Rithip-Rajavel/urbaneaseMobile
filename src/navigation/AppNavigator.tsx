import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens (will be created)
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import ProviderNavigator from './ProviderNavigator';
import AdminNavigator from './AdminNavigator';

// Import context
import { useAuth } from '../context/AuthContext';

// Import theme
import { colors } from '../utils/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthNavigator />;
  }

  // Render appropriate navigator based on user role
  switch (user.role) {
    case 'CUSTOMER':
      return <CustomerNavigator />;
    case 'SERVICE_PROVIDER':
      return <ProviderNavigator />;
    case 'ADMIN':
      return <AdminNavigator />;
    default:
      return <AuthNavigator />;
  }
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
