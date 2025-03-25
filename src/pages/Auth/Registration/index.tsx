import AuthLayout from '../components/AuthLayout/index';
import AuthHeader from '../components/AuthHeader/index';
import styles from './styles';
import { View, Alert } from 'react-native';
import Input from '../../../components/Input/index';
import { Formik, FormikValues } from 'formik';
import { RegistrationSchema } from '../../../utils/validations';
import DefaultButton from '../../../components/DefaultButton/index';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigation } from '../../../navigation/types';
import { ScreenNames } from '../../../constants/screenName';
import { register } from '../../../utils/api'; // Імпортуємо функцію register

// Типізуємо navigation
type NavigationProp = NativeStackNavigationProp<RootStackNavigation>;

interface ITouched {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export default function Registration() {
  const [touched, setTouched] = useState<ITouched>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigation = useNavigation<NavigationProp>();

  return (
    <AuthLayout>
      <AuthHeader activeTab={'registration'} />
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={async (values) => {
          try {
            // Відправляємо запит на реєстрацію
            await register(null, values.email, values.password); // name буде "User" за замовчуванням
            Alert.alert('Успіх', 'Реєстрація успішна! Увійдіть у свій акаунт.');
            navigation.navigate(ScreenNames.LOGIN_PAGE); // Перенаправляємо на сторінку входу
          } catch (error) {
            console.log('Registration error:', error.message); // Виводимо в консоль
            Alert.alert('Помилка', error.message); // Показуємо користувачу
          }
        }}
        validationSchema={RegistrationSchema()}
      >
        {({ values, setFieldValue, handleSubmit, isValid, errors }: FormikValues) => (
          <>
            <View style={styles.formContainer}>
              <Input
                onFocus={() => setTouched(prevState => ({ ...prevState, email: true }))}
                value={values.email}
                onChangeText={value => {
                  setFieldValue('email', value);
                }}
                placeholder={'Email'}
                error={touched.email && errors.email}
              />
              <Input
                onFocus={() => setTouched(prevState => ({ ...prevState, password: true }))}
                value={values.password}
                onChangeText={value => {
                  setFieldValue('password', value);
                }}
                placeholder={'Password'}
                error={touched.password && errors.password}
                secureTextEntry={true}
              />
              <Input
                onFocus={() =>
                  setTouched(prevState => ({ ...prevState, confirmPassword: true }))
                }
                value={values.confirmPassword}
                onChangeText={value => {
                  setFieldValue('confirmPassword', value);
                }}
                placeholder={'Confirm password'}
                error={touched.confirmPassword && errors.confirmPassword}
                secureTextEntry={true}
              />
            </View>
            <DefaultButton
              disabled={
                !isValid || !values.email || !values.password || !values.confirmPassword
              }
              onPress={handleSubmit}
              text={'Зареєструватись'}
            />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
}