// src/i18n/LanguageManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    return savedLanguage || 'en'; // Якщо мови немає, повертаємо 'en' за замовчуванням
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
    return 'en'; // У разі помилки повертаємо 'en'
  }
};

export const saveLanguage = async (lang: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('language', lang);
    console.log(`Language saved: ${lang}`);
  } catch (error) {
    console.error('Error saving language to AsyncStorage:', error);
  }
};