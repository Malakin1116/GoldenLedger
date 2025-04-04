// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Resource } from 'i18next';

// Визначаємо тип для перекладів
interface TranslationResources {
  settings: {
    support_the_app: string;
    support_description_1: string;
    subscribe: string;
    support_description_2: string;
    support_via_monobank: string;
    edit_profile: string;
    your_name: string;
    current_password: string;
    new_password: string;
    set_your_budget: string;
    enter_budget_amount: string;
    save_profile: string;
    save_budget: string;
    link_to_social_networks: string;
    google: string;
    facebook: string;
    x: string;
    log_out: string;
    confirming_logout: string;
    user_logged_out_successfully: string;
    going_back: string;
    toggling_language_dropdown: string;
    selected_language: string;
  };
  home: {
    add_income: string;
    add_cost: string;
    summary: {
      today: string;
      income: string;
      costs: string;
      add_income: string;
      add_cost: string;
      sum: string;
    };
  };
  calendar: {
    days_of_week: {
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
      sun: string;
    };
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
  };
  budget: {
    title: string;
  };
  dayTransactions: {
    tabs: {
      day: string;
      week: string;
      month: string;
    };
    add_income: string;
    add_cost: string;
    days_of_week: {
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
      sun: string;
    };
    income_list: {
      sum_income: string;
      add_income: string;
    };
    cost_list: {
      sum_costs: string;
      add_cost: string;
    };
    invalid_date: string;
  };
  categories: {
    income: {
      salary: string;
      freelance: string;
      investments: string;
      gifts: string;
      business: string;
      rental: string;
      dividends: string;
      other_income: string;
      all_incomes: string;
    };
    costs: {
      food: string;
      transport: string;
      housing: string;
      utilities: string;
      entertainment: string;
      shopping: string;
      health: string;
      education: string;
      travel: string;
      other_costs: string;
      all_costs: string;
    };
    modal_filter: {
      select_category: string;
      all: string;
      close: string;
    };
  };
  auth: {
    header: {
      title: string;
      welcome_text: string;
      login: string;
      registration: string;
    };
    registration: {
      email: string;
      password: string;
      confirm_password: string;
      register_button: string;
      success_title: string;
      success_message: string;
      error_title: string;
      error_message: string;
    };
    login: {
      email: string;
      password: string;
      login_button: string;
      success_title: string;
      success_message: string;
      error_title: string;
      error_message: string;
      ok_button: string;
    };
  };
}

// Визначаємо переклади для англійської мови
const enTranslation: TranslationResources = {
  settings: {
    support_the_app: 'Support the App',
    support_description_1: 'We have created a fully functional free version for you. By subscribing, you support the development and get advanced category filters instead of the icon ❤️.',
    subscribe: 'Subscribe',
    support_description_2: 'You can also support us without any additional rewards.',
    support_via_monobank: 'Support via Monobank',
    edit_profile: 'Edit Profile',
    your_name: 'Your name',
    current_password: 'Current password',
    new_password: 'New password',
    set_your_budget: 'Set your budget',
    enter_budget_amount: 'Enter budget amount',
    save_profile: 'Save Profile',
    save_budget: 'Save Budget',
    link_to_social_networks: 'Link to social networks',
    google: 'Google',
    facebook: 'Facebook',
    x: 'X',
    log_out: 'Log Out',
    confirming_logout: 'Confirming logout...',
    user_logged_out_successfully: 'User logged out successfully',
    going_back: 'Going back from SettingsPage...',
    toggling_language_dropdown: 'Toggling language dropdown',
    selected_language: 'Selected language',
  },
  home: {
    add_income: 'Add Income',
    add_cost: 'Add Cost',
    summary: {
      today: 'TODAY {{day}} {{month}}',
      income: 'Income',
      costs: 'Costs',
      add_income: 'Add Income',
      add_cost: 'Add Costs',
      sum: 'SUM',
    },
  },
  calendar: {
    days_of_week: {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    },
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
    },
  },
  budget: {
    title: 'Budget',
  },
  dayTransactions: {
    tabs: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
    },
    add_income: 'Add Income',
    add_cost: 'Add Cost',
    days_of_week: {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    },
    income_list: {
      sum_income: 'Sum Income',
      add_income: 'Add Income',
    },
    cost_list: {
      sum_costs: 'Sum Costs',
      add_cost: 'Add Costs',
    },
    invalid_date: 'Invalid Date',
  },
  categories: {
    income: {
      salary: 'Salary',
      freelance: 'Freelance',
      investments: 'Investments',
      gifts: 'Gifts',
      business: 'Business',
      rental: 'Rental',
      dividends: 'Dividends',
      other_income: 'Other Income',
      all_incomes: 'All Incomes',
    },
    costs: {
      food: 'Food',
      transport: 'Transport',
      housing: 'Housing',
      utilities: 'Utilities',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      health: 'Health',
      education: 'Education',
      travel: 'Travel',
      other_costs: 'Other Costs',
      all_costs: 'All Costs',
    },
    modal_filter: {
      select_category: 'Select Category',
      all: 'All',
      close: 'Close',
    },
  },
  auth: {
    header: {
      title: 'Money Under Your Control!',
      welcome_text: 'We will help you track your money\nand build your future.',
      login: 'Login',
      registration: 'Registration',
    },
    registration: {
      email: 'Email',
      password: 'Password',
      confirm_password: 'Confirm Password',
      register_button: 'Register',
      success_title: 'Success',
      success_message: 'Registration successful! Please log in to your account.',
      error_title: 'Error',
      error_message: 'Unknown error',
    },
    login: {
      email: 'Email',
      password: 'Password',
      login_button: 'Login',
      success_title: 'Success',
      success_message: 'Login successful!',
      error_title: 'Error',
      error_message: 'Unknown error',
      ok_button: 'OK',
    },
  },
};

// Визначаємо переклади для української мови
const ukTranslation: TranslationResources = {
  settings: {
    support_the_app: 'Підтримайте додаток',
    support_description_1: 'Ми створили для вас повністю функціональну безкоштовну версію. Підписавшись, ви підтримуєте розробку та отримуєте розширені фільтри категорій замість іконки ❤️.',
    subscribe: 'Підписатися',
    support_description_2: 'Ви також можете підтримати нас без додаткових винагород.',
    support_via_monobank: 'Підтримати через Monobank',
    edit_profile: 'Редагувати профіль',
    your_name: 'Ваше ім’я',
    current_password: 'Поточний пароль',
    new_password: 'Новий пароль',
    set_your_budget: 'Встановіть ваш бюджет',
    enter_budget_amount: 'Введіть суму бюджету',
    save_profile: 'Зберегти профіль',
    save_budget: 'Зберегти бюджет',
    link_to_social_networks: 'Прив’язка до соціальних мереж',
    google: 'Google',
    facebook: 'Facebook',
    x: 'X',
    log_out: 'Вийти',
    confirming_logout: 'Підтвердження виходу...',
    user_logged_out_successfully: 'Користувач успішно вийшов',
    going_back: 'Повернення зі сторінки налаштувань...',
    toggling_language_dropdown: 'Перемикання випадаючого списку мов',
    selected_language: 'Обрана мова',
  },
  home: {
    add_income: 'Додати дохід',
    add_cost: 'Додати витрату',
    summary: {
      today: 'СЬОГОДНІ {{day}} {{month}}',
      income: 'Дохід',
      costs: 'Витрати',
      add_income: 'Додати дохід',
      add_cost: 'Додати витрату',
      sum: 'СУМА',
    },
  },
  calendar: {
    days_of_week: {
      mon: 'Пн',
      tue: 'Вт',
      wed: 'Ср',
      thu: 'Чт',
      fri: 'Пт',
      sat: 'Сб',
      sun: 'Нд',
    },
    months: {
      january: 'Січень',
      february: 'Лютий',
      march: 'Березень',
      april: 'Квітень',
      may: 'Травень',
      june: 'Червень',
      july: 'Липень',
      august: 'Серпень',
      september: 'Вересень',
      october: 'Жовтень',
      november: 'Листопад',
      december: 'Грудень',
    },
  },
  budget: {
    title: 'Бюджет',
  },
  dayTransactions: {
    tabs: {
      day: 'День',
      week: 'Тиждень',
      month: 'Місяць',
    },
    add_income: 'Додати дохід',
    add_cost: 'Додати витрату',
    days_of_week: {
      mon: 'Понеділок',
      tue: 'Вівторок',
      wed: 'Середа',
      thu: 'Четвер',
      fri: 'П’ятниця',
      sat: 'Субота',
      sun: 'Неділя',
    },
    income_list: {
      sum_income: 'Сума доходів',
      add_income: 'Додати дохід',
    },
    cost_list: {
      sum_costs: 'Сума витрат',
      add_cost: 'Додати витрату',
    },
    invalid_date: 'Некоректна дата',
  },
  categories: {
    income: {
      salary: 'Зарплата',
      freelance: 'Фріланс',
      investments: 'Інвестиції',
      gifts: 'Подарунки',
      business: 'Бізнес',
      rental: 'Оренда',
      dividends: 'Дивіденди',
      other_income: 'Інший дохід',
      all_incomes: 'Усі доходи',
    },
    costs: {
      food: 'Їжа',
      transport: 'Транспорт',
      housing: 'Житло',
      utilities: 'Комунальні послуги',
      entertainment: 'Розваги',
      shopping: 'Покупки',
      health: 'Здоров’я',
      education: 'Освіта',
      travel: 'Подорожі',
      other_costs: 'Інші витрати',
      all_costs: 'Усі витрати',
    },
    modal_filter: {
      select_category: 'Виберіть категорію',
      all: 'Усі',
      close: 'Закрити',
    },
  },
  auth: {
    header: {
      title: 'Гроші під твоїм контролем!',
      welcome_text: 'Ми допоможемо тобі слідкувати за грошима\nта будувати своє майбутнє.',
      login: 'Вхід',
      registration: 'Реєстрація',
    },
    registration: {
      email: 'Email',
      password: 'Пароль',
      confirm_password: 'Підтвердити пароль',
      register_button: 'Зареєструватись',
      success_title: 'Успіх',
      success_message: 'Реєстрація успішна! Увійдіть у свій акаунт.',
      error_title: 'Помилка',
      error_message: 'Невідома помилка',
    },
    login: {
      email: 'Email',
      password: 'Пароль',
      login_button: 'Увійти',
      success_title: 'Успіх',
      success_message: 'Вхід успішний!',
      error_title: 'Помилка',
      error_message: 'Невідома помилка',
      ok_button: 'OK',
    },
  },
};

// Визначаємо ресурси для i18next
const resources: Resource = {
  en: { translation: enTranslation },
  uk: { translation: ukTranslation },
};

// Ініціалізація i18next (синхронно)
i18n
  .use(initReactI18next) // Підключаємо react-i18next
  .init({
    resources,
    lng: 'en', // Мова за замовчуванням (буде змінена в LanguageProvider)
    fallbackLng: 'en', // Мова на випадок, якщо переклад відсутній
    interpolation: {
      escapeValue: false, // React уже захищає від XSS
    },
  });

export default i18n;