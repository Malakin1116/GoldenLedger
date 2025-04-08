import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
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
  const [username, setUsername] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency.code);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserId(userData._id);
        setUsername(userData.name || '');
        setUser({ id: userData._id, name: userData.name, budget: 0 });
        await AsyncStorage.setItem('userId', userData._id);
        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedCurrency) {
          const parsedCurrency = JSON.parse(savedCurrency);
          setCurrency(parsedCurrency);
          setSelectedCurrency(parsedCurrency.code);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, [setUser]);

  const handleSaveProfile = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    try {
      const profileData = { name: username };
      await updateUser(userId, profileData);
      setUser({ ...user, id: userId, name: username, budget: 0 });
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

  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const handleCurrencyChange = async (code: string, symbol: string) => {
    setSelectedCurrency(code);
    const newCurrency = { code, symbol };
    setCurrency(newCurrency);
    await AsyncStorage.setItem('currency', JSON.stringify(newCurrency));
  };

  const getFlagEmoji = (lang: string) => {
    switch (lang) {
      case 'uk': return '🇺🇦';
      case 'en': return '🇺🇸';
      default: return '🇺🇸';
    }
  };

  const getCurrencyText = (currencyCode: string) => {
    switch (currencyCode) {
      case 'UAH': return 'грн';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return 'грн';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
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

        <Text style={styles.sectionDescription}>{t('settings.choose_currency')}</Text>
        <View style={styles.currencyContainer}>
          <TouchableOpacity
            style={styles.currencyOption}
            onPress={() => handleCurrencyChange('UAH', 'грн')}
          >
            <CheckBox
              value={selectedCurrency === 'UAH'}
              onValueChange={() => handleCurrencyChange('UAH', 'грн')}
              tintColor="#fff"
              onCheckColor="#5a8a9a"
              onFillColor="transparent"
              onTintColor="#5a8a9a"
              style={styles.checkBox}
            />
            <Text style={styles.currencyOptionText}>грн</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.currencyOption}
            onPress={() => handleCurrencyChange('USD', '$')}
          >
            <CheckBox
              value={selectedCurrency === 'USD'}
              onValueChange={() => handleCurrencyChange('USD', '$')}
              tintColor="#fff"
              onCheckColor="#5a8a9a"
              onFillColor="transparent"
              onTintColor="#5a8a9a"
              style={styles.checkBox}
            />
            <Text style={styles.currencyOptionText}>$</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.currencyOption}
            onPress={() => handleCurrencyChange('EUR', '€')}
          >
            <CheckBox
              value={selectedCurrency === 'EUR'}
              onValueChange={() => handleCurrencyChange('EUR', '€')}
              tintColor="#fff"
              onCheckColor="#5a8a9a"
              onFillColor="transparent"
              onTintColor="#5a8a9a"
              style={styles.checkBox}
            />
            <Text style={styles.currencyOptionText}>€</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('settings.log_out')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsPage;