import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(70, 127, 127, 1)', // Темно-зелений фон
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Білий текст
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#5a8a9a', // Зелений колір, як у активних вкладок
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10, // Закруглені кути
    alignItems: 'center',
    elevation: 3, // Тінь для Android
    shadowColor: '#000', // Тінь для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff', // Білий текст
    fontWeight: '600',
  },
  // Нові стилі для кнопки "Повернутися назад"
  backButton: {
    backgroundColor: '#5a8a9a', // Такий же зелений колір, як у logoutButton
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // Закруглені кути
    alignSelf: 'flex-start', // Кнопка зліва
    marginBottom: 20, // Відступ знизу, щоб не зливатися з заголовком
    elevation: 3, // Тінь для Android
    shadowColor: '#000', // Тінь для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff', // Білий текст, як у logoutButtonText
    fontWeight: '600',
  },
});