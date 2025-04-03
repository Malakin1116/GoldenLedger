import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';

export default StyleSheet.create({
  loginBtnContainer: {
    borderRadius: 25,
    backgroundColor: '#3b5a66',
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginText: {
      color: '#FFFFFF',
    fontFamily: fonts.MontserratRegular,
  },
});