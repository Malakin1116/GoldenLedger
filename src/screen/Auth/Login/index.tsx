import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
interface IInputValue{
    email: string;
    password: string;
}
export default function LoginPage() {
    const [inputValues, setInputValue] = useState<IInputValue>(
        { email: '', password: '' });
    const handleChangeInput = (key: 'email' | 'password', value: string) => {
        setInputValue(prevState => ({...prevState,[key]: value}))
    }
  return (
    <View style={[styles.mainWrapper]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Раді тебе вітати!</Text>
        <Text style={styles.welcomeText}>
          Кожен пухнастик заслуговує на дбайливих господарів.Ми допоможемо тобі
          знайти друга.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.authText}>Вхід</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registrationBtn}>
          <Text style={styles.authText}>Реєстрація</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Email'}
            style={styles.input}
            placeholderTextColor={'#838383'}
                      value={inputValues.email}
                      onChangeText={text=>handleChangeInput('email', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Password'}
            style={styles.input}
            placeholderTextColor={'#838383'}
                      value={inputValues.password}
                      onChangeText={text => handleChangeInput('password', text)}
                      secureTextEntry={true}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.loginBtnContainer}>
        <Text style={styles.loginText}>Увійти</Text>
      </TouchableOpacity>
    </View>
  );
}