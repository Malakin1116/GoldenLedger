// import { View } from 'react-native';
// import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Додаємо типи
// import { RootStackNavigation } from '../../../navigation/types'; // Імпортуємо типи
// import styles from '../styles';
// import AuthHeader from '../components/AuthHeader/index';
// import Input from '../../../common/components/Input/index';
// import DefaultButton from '../../../common/components/DefaultButton/index';
// import AuthLayout from '../components/AuthLayout/index';
// import { ScreenNames } from '../../../constants/screenName';

// // Типізуємо navigation
// type NavigationProp = NativeStackNavigationProp<RootStackNavigation>;

// interface IInputValue {
//   email: string;
//   password: string;
//   errorEmail: null | string;
//   errorPassword: null | string;
// }

// export default function LoginPage() {
//   const navigation = useNavigation<NavigationProp>(); // Типізуємо useNavigation
//   const [inputValues, setInputValues] = useState<IInputValue>({
//     email: '',
//     password: '',
//     errorEmail: null,
//     errorPassword: null,
//   });

//   const handleChangeInput = (
//     key: 'email' | 'password' | 'errorEmail' | 'errorPassword',
//     value: string | null,
//   ) => {
//     setInputValues(prevState => ({ ...prevState, [key]: value }));
//   };

//   const checkEmail = () => {
//     const emailValidator = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$');
//     if (!emailValidator.test(inputValues.email)) {
//       handleChangeInput('errorEmail', 'Not valid email');
//     } else {
//       handleChangeInput('errorEmail', null);
//     }
//   };

//   const checkPassword = (text: string) => {
//     if (text.length < 8) {
//       handleChangeInput('errorPassword', 'Password must be more than 8 symbols');
//     } else {
//       handleChangeInput('errorPassword', null);
//     }
//   };

//   const isDisabledLoginBtn = Boolean(
//     inputValues.errorEmail ||
//     inputValues.errorPassword ||
//     !inputValues.email ||
//     !inputValues.password,
//   );

//   return (
//     <AuthLayout>
//       <AuthHeader activeTab={'login'} />
//       <View style={styles.formContainer}>
//         <Input
//           onBlur={checkEmail}
//           value={inputValues.email}
//           onChangeText={text => handleChangeInput('email', text)}
//           error={inputValues.errorEmail}
//           placeholder={'Email'}
//         />
//         <Input
//           placeholder={'Password'}
//           value={inputValues.password}
//           onChangeText={text => {
//             handleChangeInput('password', text);
//             checkPassword(text);
//           }}
//           secureTextEntry={true}
//         />
//       </View>
//       <DefaultButton
//         onPress={() => navigation.navigate(ScreenNames.REGISTRATION_PAGE)} // Перехід
//         disabled={isDisabledLoginBtn}
//         text={'Увійти'}
//       />
//     </AuthLayout>
//   );
// }
import { View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../../../navigation/types';
import styles from '../styles';
import AuthHeader from '../components/AuthHeader/index';
import Input from '../../../common/components/Input/index';
import DefaultButton from '../../../common/components/DefaultButton/index';
import AuthLayout from '../components/AuthLayout/index';
import { ScreenNames } from '../../../constants/screenName';
import { login, getToken } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackNavigation>;

interface IInputValue {
  email: string;
  password: string;
  errorEmail: null | string;
  errorPassword: null | string;
}

export default function LoginPage() {
  const navigation = useNavigation<NavigationProp>();
  const [inputValues, setInputValues] = useState<IInputValue>({
    email: '',
    password: '',
    errorEmail: null,
    errorPassword: null,
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        Alert.alert('Успіх', 'Ви вже увійшли!');
        navigation.navigate(ScreenNames.HOME_PAGE);
      }
    };
    checkToken();
  }, [navigation]);

  const handleChangeInput = (
    key: 'email' | 'password' | 'errorEmail' | 'errorPassword',
    value: string | null,
  ) => {
    setInputValues(prevState => ({ ...prevState, [key]: value }));
  };

  const checkEmail = () => {
    const emailValidator = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$');
    if (!emailValidator.test(inputValues.email)) {
      handleChangeInput('errorEmail', 'Not valid email');
    } else {
      handleChangeInput('errorEmail', null);
    }
  };

  const checkPassword = (text: string) => {
    if (text.length < 4) {
      handleChangeInput('errorPassword', 'Password must be more than 4 symbols');
    } else {
      handleChangeInput('errorPassword', null);
    }
  };

  const handleLogin = async () => {
  try {
    const response = await login(inputValues.email, inputValues.password);
    const { accessToken } = response; // Отримуємо токен із відповіді
    if (accessToken) {
      await AsyncStorage.setItem('token', accessToken); // Зберігаємо тільки якщо токен є
      Alert.alert('Успіх', 'Вхід успішний!');
      navigation.navigate('HomeScreen'); // Зміни на потрібний екран
    } else {
      throw new Error('Токен не отримано');
    }
  } catch (error) {
    console.log('Login error:', error.message);
    Alert.alert('Помилка', error.message || 'Login failed');
  }
};

  const isDisabledLoginBtn = Boolean(
    inputValues.errorEmail ||
    inputValues.errorPassword ||
    !inputValues.email ||
    !inputValues.password,
  );

  return (
    <AuthLayout>
      <AuthHeader activeTab={'login'} />
      <View style={styles.formContainer}>
        <Input
          onBlur={checkEmail}
          value={inputValues.email}
          onChangeText={text => handleChangeInput('email', text)}
          error={inputValues.errorEmail}
          placeholder={'Email'}
        />
        <Input
          placeholder={'Password'}
          value={inputValues.password}
          onChangeText={text => {
            handleChangeInput('password', text);
            checkPassword(text);
          }}
          error={inputValues.errorPassword}
          secureTextEntry={true}
        />
      </View>
      <DefaultButton
        onPress={handleLogin}
        disabled={isDisabledLoginBtn}
        text={'Увійти'}
      />
    
    </AuthLayout>
  );
}