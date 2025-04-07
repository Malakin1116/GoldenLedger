// src/navigation/TabNavigator/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomePage from '../../pages/Home/HomePage';
import DayTransactions from '../../pages/DayTransactions/DayTransactions';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../types';
import { SettingsIcon, CalendarIcon, TransactionIcon } from '../../assets/icons/index';
import { tabNavigatorStyles } from './styles';

const Tab = createBottomTabNavigator<RootStackNavigation>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'rgb(160, 226, 226)',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: tabNavigatorStyles.tabBar,
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name={ScreenNames.HOME_PAGE}
        component={HomePage}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={tabNavigatorStyles.tabIconContainer}>
              <CalendarIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.DAY_TRANSACTIONS}
        component={DayTransactions}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={tabNavigatorStyles.tabIconContainer}>
              <TransactionIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            const currentYear = today.getFullYear();
            navigation.navigate(ScreenNames.DAY_TRANSACTIONS, {
              selectedDate: todayDate,
              selectedYear: currentYear,
            });
          },
        })}
      />
      <Tab.Screen
        name={ScreenNames.SETTINGS_PAGE}
        component={SettingsPage}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={tabNavigatorStyles.tabIconContainer}>
              <SettingsIcon width={28} height={28} fill={color} style={tabNavigatorStyles.tabBarIcon} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;