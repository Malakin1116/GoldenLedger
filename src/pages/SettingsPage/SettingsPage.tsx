import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../utils/api';
import { getCurrentUser, updateUser } from '../../api/userApi';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useUser } from '../../context/UserContext';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackNavigation>;

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { user, setUser } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const [budget, setBudget] = useState<string>('0');
  const [username, setUsername] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [budgetSavedMessage, setBudgetSavedMessage] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserId(userData._id);
        setUsername(userData.name || '');
        setBudget(userData.budget?.toString() || '0');
        setUser({ id: userData._id, name: userData.name, budget: userData.budget || 0 });
        await AsyncStorage.setItem('userId', userData._id);
        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedCurrency) setCurrency(JSON.parse(savedCurrency));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [setUser]);

  const handleSaveBudget = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const budgetValue = parseInt(budget, 10);
      if (isNaN(budgetValue)) {
        console.error('Invalid budget value');
        return;
      }
      const budgetData = { budget: budgetValue, budgetStartDate: new Date().toISOString() };
      await updateUser(userId, budgetData);
      setUser({ ...user, id: userId, name: username, budget: budgetValue });
      setBudgetSavedMessage(t('settings.budget_saved'));
      setTimeout(() => setBudgetSavedMessage(''), 3000);
      console.log('Budget saved successfully');
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const profileData = { name: username };
      await updateUser(userId, profileData);
      setUser({ ...user, id: userId, name: username, budget: parseInt(budget) || 0 });
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('userId');
      setUser(null);
      navigation.reset({ index: 0, routes: [{ name: ScreenNames.LOGIN_PAGE }] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => handleLogout();

  const handleGoBack = () => navigation.goBack();

  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const toggleCurrencyDropdown = () => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const handleCurrencyChange = async (newCurrency: { code: string; symbol: string }) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
    setIsCurrencyDropdownOpen(false);
  };

  const getFlagEmoji = (lang: string) => {
    switch (lang) {
      case 'uk': return '🇺🇦';
      case 'en': return '🇺🇸';
      default: return '🇺🇸';
    }
  };

  const getCurrencyEmoji = (currencyCode: string) => {
    switch (currencyCode) {
      case 'UAH': return '🇺🇦';
      case 'USD': return '🇺🇸';
      case 'EUR': return '🇪🇺';
      default: return '🇺🇦';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

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
                <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('uk')}>
                  <Text style={styles.languageOptionText}>🇺🇦 Ukr</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('en')}>
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
                <TouchableOpacity style={styles.currencyOption} onPress={() => handleCurrencyChange({ code: 'UAH', symbol: 'грн' })}>
                  <Text style={styles.currencyOptionText}>🇺🇦 грн</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.currencyOption} onPress={() => handleCurrencyChange({ code: 'USD', symbol: '$' })}>
                  <Text style={styles.currencyOptionText}>🇺🇸 $</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.currencyOption} onPress={() => handleCurrencyChange({ code: 'EUR', symbol: '€' })}>
                  <Text style={styles.currencyOptionText}>🇪🇺 €</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
          <Text style={styles.saveButtonText}>{t('settings.save_budget')}</Text>
        </TouchableOpacity>
        {budgetSavedMessage ? <Text style={styles.successMessage}>{budgetSavedMessage}</Text> : null}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>{t('settings.log_out')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsPage;