import { StyleSheet } from 'react-native';
import {fonts} from '../../../../constants/fonts';
export default StyleSheet.create({
   titleContainer: {
    gap: 4,
    },
    title: {
        fontSize: 24,
        color: 'black',
        fontFamily: fonts.ComfortaaRegular,
    },
    welcomeText: {
    fontSize: 16,
    color: 'black',
    fontFamily: fonts.MontserratRegular,
    },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EAE9FB',
    padding: 4,
    borderRadius: 20,
    marginTop: 32,
    },
     activeTab: {
    alignItems: 'center',
    backgroundColor: '#F8F8F9',
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
    },
        authText: {
    color: '#0B0B0B',
    fontSize: 14,
    fontFamily: fonts.MontserratRegular,
  },
});
