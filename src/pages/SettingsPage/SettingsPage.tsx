// src/pages/SettingsPage/SettingsPage.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { logout } from '../../utils/api';
import styles from './styles';
import { ScreenNames } from '../../constants/screenName';
import { RootStackNavigation } from '../../navigation/types';

type NavigationProp = StackNavigationProp<RootStackNavigation>;

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [budget, setBudget] = useState<string>('0');
  const [username, setUsername] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [language, setLanguage] = useState<string>('en'); // Default language: English
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);

  const handleSaveBudget = () => {
    console.log('Saving budget:', budget);
  };

  const handleSubscribe = () => {
    console.log('Redirecting to subscription...');
  };

  const handleSupportUs = async () => {
    const monobankUrl = 'https://send.monobank.ua/jar/your-monobank-jar-id'; // Replace with your actual Monobank jar link
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

  const handleSaveProfile = () => {
    console.log('Saving profile:', { username, oldPassword, newPassword });
  };

  const handleGoogleLink = () => {
    console.log('Linking to Google...');
  };

  const handleFacebookLink = () => {
    console.log('Linking to Facebook...');
  };

  const handleXLink = () => {
    console.log('Linking to X...');
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenNames.LOGIN_PAGE }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => {
    console.log('Confirming logout...');
    handleLogout();
  };

  const handleGoBack = () => {
    console.log('Going back from SettingsPage...');
    navigation.goBack();
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    console.log('Toggling language dropdown:', !isLanguageDropdownOpen);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
    console.log('Selected language:', lang);
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

  return (
    <ScrollView style={styles.container}>
      {/* Close Button (Cross) */}
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {/* Section 1: Subscription and Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support the App</Text>
        <Text style={styles.sectionDescription}>
          We have created a fully functional free version for you. By subscribing, you support the development and get advanced category filters instead of the icon ❤️.
        </Text>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subscribe</Text>
        </TouchableOpacity>
        <Text style={styles.sectionDescription}>
          You can also support us without any additional rewards.
        </Text>
        <TouchableOpacity style={styles.supportButton} onPress={handleSupportUs}>
          <Text style={styles.supportButtonText}>Support via Monobank</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Profile Editing and Budget Settings */}
      <View style={styles.section}>
        {/* Language Selection and Section Title */}
        <View style={styles.headerWithLanguage}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
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
          placeholder="Your name"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Current password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <Text style={styles.sectionDescription}>Set your budget:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter budget amount"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
          <Text style={styles.saveButtonText}>Save Budget</Text>
        </TouchableOpacity>

        <Text style={styles.sectionDescription}>Link to social networks:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLink}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLink}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleXLink}>
            <Text style={styles.socialButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsPage;
