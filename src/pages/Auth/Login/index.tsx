// src/pages/Auth/Login.tsx
import { View, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../../../navigation/types';
import styles from './styles';
import AuthHeader from '../components/AuthHeader';
import Input from '../../../components/Input';
import DefaultButton from '../../../components/DefaultButton';
import AuthLayout from '../components/AuthLayout';
import { login, getToken } from '../../../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackNavigation>;

interface IInputValue {
  email: string;
  password: string;
  errorEmail: string | undefined;
  errorPassword: string | undefined;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [inputValues, setInputValues] = useState<IInputValue>({
    email: '',
    password: '',
    errorEmail: undefined,
    errorPassword: undefined,
  });

  const navigationToHome = useCallback(() => {
    console.log('Navigating to HomePage');
    navigation.navigate({ name: 'HomePage', params: {} });
  }, [navigation]);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        console.log('Token found, navigating to HomePage');
        navigationToHome();
      }
    };
    checkToken();
  }, [navigationToHome]);

  const handleChangeInput = (
    key: 'email' | 'password' | 'errorEmail' | 'errorPassword',
    value: string | undefined,
  ) => {
    setInputValues(prevState => ({ ...prevState, [key]: value }));
  };

  const checkEmail = () => {
    const emailValidator = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$');
    if (!emailValidator.test(inputValues.email)) {
      handleChangeInput('errorEmail', 'Not valid email');
    } else {
      handleChangeInput('errorEmail', undefined);
    }
  };

  const checkPassword = (text: string) => {
    if (text.length < 4) {
      handleChangeInput('errorPassword', 'Password must be more than 4 symbols');
    } else {
      handleChangeInput('errorPassword', undefined);
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
      Alert.alert(
        t('auth.login.success_title'),
        t('auth.login.success_message'),
        [
          {
            text: t('auth.login.ok_button'),
            onPress: () => {
              navigationToHome();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('auth.login.error_message');
      console.log('Login failed with error:', errorMessage);
      Alert.alert(t('auth.login.error_title'), errorMessage);
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
          placeholder={t('auth.login.email')}
        />
        <Input
          placeholder={t('auth.login.password')}
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
        text={t('auth.login.login_button')}
      />
    </AuthLayout>
  );
}