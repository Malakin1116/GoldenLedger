import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../constants/screenName';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackNavigation } from '../../../../navigation/types';

interface IAuthHeader {
  activeTab: 'login' | 'registration';
}
export default function AuthHeader({ activeTab }: IAuthHeader) {
  const navigation = useNavigation<StackNavigationProp<RootStackNavigation>>();
  const navigationToLogin = () => {
    navigation.navigate(ScreenNames.LOGIN_PAGE);
   };
  const navigationToRegistration = () => { 
    navigation.navigate(ScreenNames.REGISTRATION_PAGE);
  };
  return (
    <>
      <View style={[styles.titleContainer]}>
        <Text style={styles.title}>Раді тебе вітати!</Text>
        <Text style={styles.welcomeText}>
          Кожен пухнастик заслуговує на дбайливих господарів.{'\n'}Ми допоможемо
          тобі знайти друга.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={()=>{navigationToLogin()}}
          style={activeTab === 'login' ? styles.activeTab : styles.disabledTab}>
          <Text style={styles.authText}>Вхід</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{navigationToRegistration()}}
          style={
            activeTab === 'registration' ? styles.activeTab : styles.disabledTab
          }>
          <Text style={styles.authText}>Реєстрація</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}