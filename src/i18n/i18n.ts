// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';

// Імпортуємо модулі перекладів
import { settingsEn, settingsUk } from './translations/settings';
import { homeEn, homeUk } from './translations/home';
import { calendarEn, calendarUk } from './translations/calendar';
import { budgetEn, budgetUk } from './translations/budget';
import { dayTransactionsEn, dayTransactionsUk } from './translations/dayTransactions';
import { categoriesEn, categoriesUk } from './translations/categories';
import { authEn, authUk } from './translations/auth';
import { periodSummaryEn, periodSummaryUk } from './translations/periodSummary'; // Додаємо нові переклади

// Визначаємо тип для перекладів
interface TranslationResources {
  settings: typeof settingsEn;
  home: typeof homeEn;
  calendar: typeof calendarEn;
  budget: typeof budgetEn;
  dayTransactions: typeof dayTransactionsEn;
  categories: typeof categoriesEn;
  auth: typeof authEn;
  periodSummary: typeof periodSummaryEn; // Додаємо periodSummary
}

// Об’єднуємо переклади для англійської мови
const enTranslation: TranslationResources = {
  settings: settingsEn,
  home: homeEn,
  calendar: calendarEn,
  budget: budgetEn,
  dayTransactions: dayTransactionsEn,
  categories: categoriesEn,
  auth: authEn,
  periodSummary: periodSummaryEn, // Додаємо periodSummary
};

// Об’єднуємо переклади для української мови
const ukTranslation: TranslationResources = {
  settings: settingsUk,
  home: homeUk,
  calendar: calendarUk,
  budget: budgetUk,
  dayTransactions: dayTransactionsUk,
  categories: categoriesUk,
  auth: authUk,
  periodSummary: periodSummaryUk, // Додаємо periodSummary
};

// Визначаємо ресурси для i18next
const resources: Resource = {
  en: { translation: enTranslation },
  uk: { translation: ukTranslation },
};

// Ініціалізація i18next (синхронно)
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Мова за замовчуванням (буде змінена в LanguageProvider)
    fallbackLng: 'en', // Мова на випадок, якщо переклад відсутній
    interpolation: {
      escapeValue: false, // React уже захищає від XSS
    },
  });

export default i18n;