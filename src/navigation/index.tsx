import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Розкоментуємо SafeAreaProvider
import LoginPage from '../screen/Auth/Login';
import Registration from '../screen/Auth/Registration';
import { ScreenNames } from '../constants/screenName';
import { RootStackNavigation } from './types';




// Створюємо екземпляр Stack
const Stack = createNativeStackNavigator<RootStackNavigation>();

export default function RootNavigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={ScreenNames.LOGIN_PAGE}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name={ScreenNames.LOGIN_PAGE} component={LoginPage} />
          <Stack.Screen name={ScreenNames.REGISTRATION_PAGE} component={Registration} />
         
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}