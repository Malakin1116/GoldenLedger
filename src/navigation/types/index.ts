export type RootStackNavigation = {
  LoginPage: undefined;
  RegistrationPage: undefined;
  HomePage: {
    selectedDate?: string;
    selectedYear?: number;
    monthlyTransactions?: Transaction[];
  };
  DayTransactions: {
    selectedDate: string;
    selectedYear?: number;
    monthlyTransactions?: Transaction[];
  };
  SettingsPage: undefined;
  Tabs: undefined; // Додаємо Tabs
};

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
}