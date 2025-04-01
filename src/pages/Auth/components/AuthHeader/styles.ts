import { StyleSheet } from 'react-native';
import { fonts } from '../../../../constants/fonts';

export default StyleSheet.create({
  titleContainer: {
    gap: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'rgb(221, 227, 227)',
    fontFamily: fonts.ComfortaaRegular,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(214, 219, 219, 0.79)',
    fontFamily: fonts.MontserratRegular,
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
    backgroundColor: '#6BAABF', // Більш насичений блакитний для контрасту
    padding: 10,
    borderRadius: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF', // Біле обведення
    shadowColor: '#000', // Тінь для ефекту підйому
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Тінь для Android
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
});