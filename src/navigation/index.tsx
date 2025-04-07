// src/navigation/RootNavigation.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import LoginPage from '../pages/Auth/Login';
import Registration from '../pages/Auth/Registration';
import { ScreenNames } from '../constants/screenName';
import { RootStackNavigation } from './types';
import { AuthProvider } from '../context/AuthContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { TransactionProvider } from '../context/TransactionContext';
import TabNavigator from './TabNavigator/TabNavigator';

const Stack = createNativeStackNavigator<RootStackNavigation>();

const pingServer = async () => {
  try {
    const response = await fetch('https://bug1116.onrender.com/transactions/ping');
    const data = await response.json();
    console.log(`Пінг о ${new Date().toISOString()}: ${data.message}`);
  } catch (error) {
    console.error(`Пінг не вдався о ${new Date().toISOString()}:`, error);
  }
};

export default function RootNavigation() {
  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider navigation={undefined as any}>
      <CurrencyProvider>
        <TransactionProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={ScreenNames.LOGIN_PAGE}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name={ScreenNames.LOGIN_PAGE} component={LoginPage} />
              <Stack.Screen name={ScreenNames.REGISTRATION_PAGE} component={Registration} />
              <Stack.Screen name="Tabs" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </TransactionProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}