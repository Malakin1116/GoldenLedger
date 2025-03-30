import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';

export default StyleSheet.create({
  summaryContainer: {
    padding: 20,
    marginTop: 15,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  todayText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: fonts.MontserratMedium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: fonts.ComfortaaRegular,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#5a8a9a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.MontserratMedium,
  },
  sumText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.MontserratMedium,
  },
});