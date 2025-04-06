// src/pages/SettingsPage/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../utils/api';
import { getCurrentUser, updateUser } from '../../api/userApi';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext'; // Додаємо хук для валюти
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackNavigation>;

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency(); // Використовуємо глобальний контекст валюти
  const navigation = useNavigation<NavigationProp>();
  const [budget, setBudget] = useState<string>('0');
  const [username, setUsername] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        console.log('Fetched user data:', userData);
        setUserId(userData._id);
        setUsername(userData.name || '');
        setBudget(userData.budget?.toString() || '0');
        await AsyncStorage.setItem('userId', userData._id);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveBudget = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const budgetData = {
        budget: parseInt(budget, 10),
        budgetStartDate: new Date().toISOString(),
        currency: currency.code, // Додаємо валюту до даних
      };
      console.log('Saving budget with data:', budgetData);
      await updateUser(userId, budgetData);
      console.log('Budget saved successfully');
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const handleSubscribe = () => {
    console.log(t('settings.redirecting_to_subscription'));
  };

  const handleSupportUs = async () => {
    const monobankUrl = 'https://send.monobank.ua/jar/your-monobank-jar-id';
    try {
      const supported = await Linking.canOpenURL(monobankUrl);
      if (supported) {
        await Linking.openURL(monobankUrl);
        console.log('Opened Monobank jar link:', monobankUrl);
      } else {
        console.log('Unable to open Monobank link:', monobankUrl);
      }
    } catch (error) {
      console.error('Error opening Monobank link:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const profileData = {
        name: username,
      };
      console.log('Saving profile with data:', profileData);
      await updateUser(userId, profileData);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('userId');
      console.log(t('settings.user_logged_out_successfully'));
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenNames.LOGIN_PAGE }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => {
    console.log(t('settings.confirming_logout'));
    handleLogout();
  };

  const handleGoBack = () => {
    console.log(t('settings.going_back'));
    navigation.goBack();
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    console.log(`${t('settings.toggling_language_dropdown')}: ${!isLanguageDropdownOpen}`);
  };

  const toggleCurrencyDropdown = () => {
    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
    console.log(`${t('settings.toggling_currency_dropdown')}: ${!isCurrencyDropdownOpen}`);
  };

  const handleLanguageChange = (lang: string) => {
    console.log('Changing language to:', lang);
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
    console.log(`${t('settings.selected_language')}: ${lang}`);
  };

  const handleCurrencyChange = (newCurrency: { code: string; symbol: string }) => {
    console.log('Changing currency to:', newCurrency);
    setCurrency(newCurrency);
    setIsCurrencyDropdownOpen(false);
    console.log(`${t('settings.selected_currency')}: ${newCurrency.symbol}`);
  };

  const getFlagEmoji = (lang: string) => {
    switch (lang) {
      case 'uk':
        return '🇺🇦';
      case 'en':
        return '🇺🇸';
      default:
        return '🇺🇸';
    }
  };

  const getCurrencyEmoji = (currencyCode: string) => {
    switch (currencyCode) {
      case 'UAH':
        return '🇺🇦';
      case 'USD':
        return '🇺🇸';
      case 'EUR':
        return '🇪🇺';
      default:
        return '🇺🇦';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.support_the_app')}</Text>
        <Text style={styles.sectionDescription}>{t('settings.support_description_1')}</Text>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>{t('settings.subscribe')}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionDescription}>{t('settings.support_description_2')}</Text>
        <TouchableOpacity style={styles.supportButton} onPress={handleSupportUs}>
          <Text style={styles.supportButtonText}>{t('settings.support_via_monobank')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.headerWithLanguage}>
          <Text style={styles.sectionTitle}>{t('settings.edit_profile')}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity style={styles.languageSelector} onPress={toggleLanguageDropdown}>
              <Text style={styles.languageFlag}>{getFlagEmoji(language)}</Text>
              <Text style={styles.languageArrow}>{isLanguageDropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isLanguageDropdownOpen && (
              <View style={styles.languageDropdown}>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleLanguageChange('uk')}
                >
                  <Text style={styles.languageOptionText}>🇺🇦 Ukr</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={styles.languageOptionText}>🇺🇸 Eng</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder={t('settings.your_name')}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder={t('settings.current_password')}
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder={t('settings.new_password')}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>{t('settings.save_profile')}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionDescription}>{t('settings.set_your_budget')}</Text>
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('settings.enter_budget_amount')}
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          <View style={styles.currencyContainer}>
            <TouchableOpacity style={styles.currencySelector} onPress={toggleCurrencyDropdown}>
              <Text style={styles.currencyFlag}>{getCurrencyEmoji(currency.code)}</Text>
              <Text style={styles.currencyArrow}>{isCurrencyDropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isCurrencyDropdownOpen && (
              <View style={styles.currencyDropdown}>
                <TouchableOpacity
                  style={styles.currencyOption}
                  onPress={() => handleCurrencyChange({ code: 'UAH', symbol: 'грн' })}
                >
                  <Text style={styles.currencyOptionText}>🇺🇦 грн</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.currencyOption}
                  onPress={() => handleCurrencyChange({ code: 'USD', symbol: '$' })}
                >
                  <Text style={styles.currencyOptionText}>🇺🇸 $</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.currencyOption}
                  onPress={() => handleCurrencyChange({ code: 'EUR', symbol: '€' })}
                >
                  <Text style={styles.currencyOptionText}>🇪🇺 €</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
          <Text style={styles.saveButtonText}>{t('settings.save_budget')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>{t('settings.log_out')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsPage;