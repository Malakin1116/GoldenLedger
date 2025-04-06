import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import LoginPage from '../pages/Auth/Login';
import Registration from '../pages/Auth/Registration';
import HomePage from '../pages/Home/HomePage';
import DayTransactions from '../pages/DayTransactions/DayTransactions';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import { ScreenNames } from '../constants/screenName';
import { RootStackNavigation } from './types';
import { AuthProvider } from '../context/AuthContext';
import { SettingsIcon, WalletIcon, CalendarIcon } from '../assets/icons/index';

const Stack = createNativeStackNavigator<RootStackNavigation>();
const Tab = createBottomTabNavigator<RootStackNavigation>(); // Використовуємо RootStackNavigation для Tab

const pingServer = async () => {
  try {
    const response = await fetch('https://bug1116.onrender.com/transactions/ping');
    const data = await response.json();
    console.log(`Пінг о ${new Date().toISOString()}: ${data.message}`);
  } catch (error) {
    console.error(`Пінг не вдався о ${new Date().toISOString()}:`, error);
  }
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name={ScreenNames.HOME_PAGE}
      component={HomePage}
      options={{
        tabBarLabel: 'Головна',
        tabBarIcon: ({ color }) => <WalletIcon color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name={ScreenNames.DAY_TRANSACTIONS}
      component={DayTransactions}
      options={{
        tabBarLabel: 'Транзакції',
        tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name={ScreenNames.SETTINGS_PAGE}
      component={SettingsPage}
      options={{
        tabBarLabel: 'Налаштування',
        tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} />,
      }}
    />
  </Tab.Navigator>
);

export default function RootNavigation() {
  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider navigation={undefined as any}>
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
    </AuthProvider>
  );
}