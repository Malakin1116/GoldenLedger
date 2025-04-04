// src/components/AuthHeader/AuthHeader.tsx
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../context/LanguageContext';
import { ScreenNames } from '../../../../constants/screenName';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackNavigation } from '../../../../navigation/types';

interface IAuthHeader {
  activeTab: 'login' | 'registration';
}

export default function AuthHeader({ activeTab }: IAuthHeader) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage(); // Використовуємо changeLanguage
  const navigation = useNavigation<StackNavigationProp<RootStackNavigation>>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const navigationToLogin = () => {
    navigation.navigate(ScreenNames.LOGIN_PAGE);
  };

  const navigationToRegistration = () => {
    navigation.navigate(ScreenNames.REGISTRATION_PAGE);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLanguageChange = (lang: 'en' | 'uk') => {
    changeLanguage(lang); // Використовуємо changeLanguage замість setLanguage
    setIsDropdownVisible(false);
  };

  return (
    <>
      <View style={[styles.titleContainer]}>
        <Text style={styles.title}>{t('auth.header.title')}</Text>
        <Text style={styles.welcomeText}>{t('auth.header.welcome_text')}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigationToLogin()}
          style={activeTab === 'login' ? styles.activeTab : styles.disabledTab}
        >
          <Text style={styles.authText}>{t('auth.header.login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigationToRegistration()}
          style={activeTab === 'registration' ? styles.activeTab : styles.disabledTab}
        >
          <Text style={styles.authText}>{t('auth.header.registration')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.languageButton}>
          <Text style={styles.languageText}>
            {language === 'en' ? '🇬🇧' : '🇺🇦'}
          </Text>
        </TouchableOpacity>
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => handleLanguageChange('en')}
              style={language === 'en' ? styles.activeDropdownItem : styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>🇬🇧</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLanguageChange('uk')}
              style={language === 'uk' ? styles.activeDropdownItem : styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>🇺🇦</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}