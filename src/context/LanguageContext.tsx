// src/context/LanguageContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import i18n from '../i18n/i18n';
import { saveLanguage, loadLanguage } from '../i18n/LanguageManager';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Завантажуємо мову з AsyncStorage при ініціалізації
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = await loadLanguage();
      console.log('LanguageContext: Initializing language:', savedLanguage);
      setLanguage(savedLanguage);
      await i18n.changeLanguage(savedLanguage);
      setIsLoaded(true);
    };

    initializeLanguage();
  }, []);

  // Змінюємо мову і зберігаємо її в AsyncStorage
  const changeLanguage = async (lang: string) => {
    console.log('LanguageContext: Changing language to:', lang);
    setLanguage(lang);
    await i18n.changeLanguage(lang);
    await saveLanguage(lang);
    console.log('LanguageContext: Language changed, current i18n language:', i18n.language);
  };

  // Функція для перекладу (залишаємо для сумісності, але не використовуємо для Budget)
  const t = (key: string): string => {
    return i18n.t(key);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для використання контексту
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};