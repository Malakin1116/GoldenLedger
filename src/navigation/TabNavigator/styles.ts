// src/navigation/styles/TabNavigatorStyles.ts
import { StyleSheet } from 'react-native';

export const tabNavigatorStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#3b5a66',
    borderTopWidth: 1,
    borderTopColor: '#3b5a66',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    height: 44,
    paddingBottom: 5,
    paddingHorizontal: 20, // Додаємо горизонтальні відступи для рівномірного розподілу
    flexDirection: 'row', // Забезпечуємо рівномірний розподіл
    justifyContent: 'space-between', // Розподіляємо іконки рівномірно
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  tabIconContainer: {
    flex: 1, // Забезпечуємо однаковий простір для кожної іконки
    alignItems: 'center', // Центруємо іконку по горизонталі
    justifyContent: 'center', // Центруємо іконку по вертикалі
  },
  tabBarIcon: {
    marginTop: 4,
  },
});