// src/navigation/TabNavigator/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../../pages/Home/HomePage';
import DayTransactions from '../../pages/DayTransactions/DayTransactions';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../types';
import { SettingsIcon, CalendarIcon, TransactionIcon } from '../../assets/icons/index'; // Замінено WalletIcon на CalendarIcon
import { tabNavigatorStyles } from './styles';

const Tab = createBottomTabNavigator<RootStackNavigation>();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: tabNavigatorStyles.tabBar,
      tabBarLabelStyle: { display: 'none' }, // Прибираємо мітки
    }}
  >
    <Tab.Screen
      name={ScreenNames.HOME_PAGE}
      component={HomePage}
      options={{
        tabBarIcon: ({ color }) => (
          <CalendarIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} /> // Замінено на CalendarIcon
        ),
      }}
    />
    <Tab.Screen
      name={ScreenNames.DAY_TRANSACTIONS}
      component={DayTransactions}
      options={{
        tabBarIcon: ({ color }) => (
          <TransactionIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} />
        ),
      }}
    />
    <Tab.Screen
      name={ScreenNames.SETTINGS_PAGE}
      component={SettingsPage}
      options={{
        tabBarIcon: ({ color }) => (
          <SettingsIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;