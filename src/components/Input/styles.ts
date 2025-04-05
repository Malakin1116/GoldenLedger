// src/components/Input/styles.ts
import { Platform, StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';

export default StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: 25,
    marginVertical: 4,
    paddingHorizontal: 24,
    borderColor: 'rgba(221, 227, 227, 0.35)',
    paddingVertical: Platform.select({
      android: 12,
      ios: 14,
      default: 12,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    padding: 0,
    flex: 1,
    fontFamily: fonts.MontserratRegular,
    color: 'rgb(221, 227, 227)',
  },
  errorText: {
    color: 'rgb(255, 60, 60)', // Червоний колір для помилки
    fontSize: 14, // Менший розмір шрифту
    fontFamily: fonts.MontserratRegular, // Використовуємо той же шрифт, що й для input
    marginLeft: 24, // Вирівнюємо з paddingHorizontal inputContainer
    marginTop: 4, // Невеликий відступ зверху, щоб відповідати marginVertical
  },
});