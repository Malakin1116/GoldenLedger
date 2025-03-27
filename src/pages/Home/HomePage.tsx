import { View, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react'; // Додаємо useCallback
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../../navigation/types/index';
import styles from './styles';
import AuthHeader from '../Auth/components/AuthHeader/index';
import Input from '../../components/Input/index';
import DefaultButton from '../../components/DefaultButton/index';
import AuthLayout from '../Auth/components/AuthLayout';
import { login, getToken } from '../../utils/api';

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

  // Загортаємо navigationToHome у useCallback
  const navigationToHome = useCallback(() => {
    navigation.navigate('HomePage'); // Передаємо рядок 'HomePage'
  }, [navigation]); // Залежність navigation

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        Alert.alert('Успіх', 'Ви вже увійшли!');
        navigationToHome();
      }
    };
    checkToken();
  }, [navigationToHome]); // Залишаємо navigationToHome у залежностях

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
    console.log('Attempting login with:', {
      email: inputValues.email,
      password: inputValues.password,
    });

    try {
      const response = await login(inputValues.email, inputValues.password);
      console.log('Login successful:', response);
      Alert.alert('Успіх', 'Вхід успішний!');
      navigationToHome();
    } catch (error) {
      console.log('Login failed with error:', error.message);
      Alert.alert('Помилка', error.message);
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
