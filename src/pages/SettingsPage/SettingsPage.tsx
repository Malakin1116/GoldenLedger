import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { logout } from '../../utils/api'; // Імпортуємо функцію logout із API
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../../navigation/types';

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackNavigation>>();

  const handleLogout = async () => {
    try {
      // Викликаємо функцію logout із API
      await logout();

      // Перенаправляємо на екран авторизації
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenNames.LOGIN_PAGE }],
      });
    } catch (error) {
      Alert.alert('Помилка', error.message || 'Не вдалося вийти з акаунту.');
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => {
    // Показуємо підтвердження перед виходом
    Alert.alert(
      'Вихід із акаунту',
      'Ви впевнені, що хочете вийти?',
      [
        {
          text: 'Скасувати',
          style: 'cancel',
        },
        {
          text: 'Вийти',
          style: 'destructive',
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
      <View style={styles.container}>
          
      <Text style={styles.title}>Налаштування</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Вийти з акаунту</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPage;