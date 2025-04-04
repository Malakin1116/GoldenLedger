// src/components/AuthHeader/styles.ts
import { StyleSheet } from 'react-native';
import { fonts } from '../../../../constants/fonts';

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Розташовуємо елементи в рядок
    justifyContent: 'space-between', // Напис зліва, перемикач справа
    alignItems: 'center', // Вирівнюємо по вертикалі
    marginVertical: 10,
  },
  titleContainer: {
    flex: 1, // Напис займає доступний простір зліва
  },
  title: {
    fontSize: 24,
    textAlign: 'left', // Вирівнюємо текст зліва
    color: 'rgb(221, 227, 227)',
    fontFamily: fonts.ComfortaaRegular,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(214, 219, 219, 0.79)',
    fontFamily: fonts.MontserratRegular,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    gap: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(70, 127, 127, 1)',
  },
  activeTab: {
    alignItems: 'center',
    backgroundColor: '#6BAABF',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledTab: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    opacity: 0.7,
    backgroundColor: 'rgba(96, 186, 186, 0.45)',
  },
  authText: {
    color: 'rgb(221, 227, 227)',
    fontSize: 14,
    fontFamily: fonts.MontserratRegular,
  },
  languageContainer: {
    position: 'relative',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#6BAABF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  languageText: {
    color: 'rgb(221, 227, 227)',
    fontSize: 20,
    fontFamily: fonts.MontserratRegular,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0, // Вирівнюємо випадаюче меню справа
    backgroundColor: 'rgba(70, 127, 127, 1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDropdownItem: {
    paddingVertical: 8,
     borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: '#6BAABF',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownText: {
    color: 'rgb(221, 227, 227)',
    fontSize: 20,
    fontFamily: fonts.MontserratRegular,
  },
});