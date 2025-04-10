// src/navigation/RootNavigation.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import LoginPage from '../pages/Auth/Login';
import Registration from '../pages/Auth/Registration';
import HomePage from '../pages/Home/HomePage';
import DayTransactions from '../pages/DayTransactions/DayTransactions';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import { ScreenNames } from '../constants/screenName';
import { RootStackNavigation } from './types';
import { AuthProvider } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackNavigation>();

const pingServer = async () => {
  try {
    const response = await fetch('https://bug1116.onrender.com/transactions/ping');
    const data = await response.json();
    console.log(`Ping at ${new Date().toISOString()}: ${data.message}`);
  } catch (error) {
    console.error(`Ping failed at ${new Date().toISOString()}:`, error);
  }
};

export default function RootNavigation() {
  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider navigation={undefined as any}> {/* Тимчасово передаємо navigation як undefined */}
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={ScreenNames.LOGIN_PAGE}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name={ScreenNames.LOGIN_PAGE} component={LoginPage} />
            <Stack.Screen name={ScreenNames.REGISTRATION_PAGE} component={Registration} />
            <Stack.Screen name={ScreenNames.HOME_PAGE} component={HomePage} />
            <Stack.Screen name={ScreenNames.DAY_TRANSACTIONS} component={DayTransactions} />
            <Stack.Screen name={ScreenNames.SETTINGS_PAGE} component={SettingsPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
