import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useAppDispatch } from '../hooks/useAppSelector';
import { loadLanguage } from '../i18n/LanguageManager';
import { loadLanguageSuccess, setLoaded } from '../store/slices/languageSlice';
import { loadCurrency } from '../store/slices/currencySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../pages/Auth/Login';
import Registration from '../pages/Auth/Registration';
import { ScreenNames } from '../constants/screenName';
import { RootStackNavigation } from './types';
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

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedLanguage = await loadLanguage();
        dispatch(loadLanguageSuccess(savedLanguage));

        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedCurrency) {
          dispatch(loadCurrency(JSON.parse(savedCurrency)));
        }

        dispatch(setLoaded(true));
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch(setLoaded(true));
      }
    };

    initializeApp();
  }, [dispatch]);

  return <>{children}</>;
};

export default function RootNavigation() {
  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Provider store={store}>
      <AppInitializer>
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
      </AppInitializer>
    </Provider>
  );
}