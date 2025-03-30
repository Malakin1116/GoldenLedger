import { StyleSheet } from 'react-native';
import { fonts } from '../../../../constants/fonts';

export default StyleSheet.create({
  titleContainer: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    color: 'rgb(44, 56, 49)', // Темно-зелений для заголовка
    fontFamily: fonts.ComfortaaRegular,
  },
  welcomeText: {
    fontSize: 16,
    color: '#1A3C34', // Середньо-зелений для тексту
    fontFamily: fonts.MontserratRegular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',// Світло-зелений фон для контейнера кнопок
    padding: 4,
    gap:5,
    borderRadius: 15,
    marginTop: 32,
  },
  activeTab: {
    alignItems: 'center',
    backgroundColor: '#A9D6B9', // Світло-зелений для активної вкладки
    padding: 10,
    borderRadius: 20,
    flex: 1,
  },
  disabledTab: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    opacity: 0.7,
    backgroundColor: '#D9E8D8', // Дуже світло-зелений для неактивної вкладки
  },
  authText: {
    color: '#1A3C34', // Темно-зелений для тексту кнопок
    fontSize: 14,
    fontFamily: fonts.MontserratRegular,
  },
});