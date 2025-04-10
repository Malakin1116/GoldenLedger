import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';
import { settingsEn, settingsUk } from './translations/settings';
import { homeEn, homeUk } from './translations/home';
import { calendarEn, calendarUk } from './translations/calendar';
import { budgetEn, budgetUk } from './translations/budget';
import { dayTransactionsEn, dayTransactionsUk } from './translations/dayTransactions';
import { categoriesEn, categoriesUk } from './translations/categories';
import { authEn, authUk } from './translations/auth';
import { periodSummaryEn, periodSummaryUk } from './translations/periodSummary';
import { addTransactionModalEn, addTransactionModalUk } from './translations/addTransactionModal';
import { editCategoriesModalEn, editCategoriesModalUk } from './translations/editCategoriesModal';

interface TranslationResources {
  settings: typeof settingsEn;
  home: typeof homeEn;
  calendar: typeof calendarEn;
  budget: typeof budgetEn;
  dayTransactions: typeof dayTransactionsEn;
  categories: typeof categoriesEn;
  auth: typeof authEn;
  periodSummary: typeof periodSummaryEn;
  addTransactionModal: typeof addTransactionModalEn;
  editCategoriesModal: typeof editCategoriesModalEn;
}

const enTranslation: TranslationResources = {
  settings: settingsEn,
  home: homeEn,
  calendar: calendarEn,
  budget: budgetEn,
  dayTransactions: dayTransactionsEn,
  categories: categoriesEn,
  auth: authEn,
  periodSummary: periodSummaryEn,
  addTransactionModal: addTransactionModalEn,
  editCategoriesModal: editCategoriesModalEn,
};

const ukTranslation: TranslationResources = {
  settings: settingsUk,
  home: homeUk,
  calendar: calendarUk,
  budget: budgetUk,
  dayTransactions: dayTransactionsUk,
  categories: categoriesUk,
  auth: authUk,
  periodSummary: periodSummaryUk,
  addTransactionModal: addTransactionModalUk,
  editCategoriesModal: editCategoriesModalUk,
};

const resources: Resource = {
  en: { translation: enTranslation },
  uk: { translation: ukTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Мова за замовчуванням (буде змінена через Redux)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;