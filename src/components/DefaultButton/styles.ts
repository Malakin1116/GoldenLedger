import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';

export default StyleSheet.create({
  loginBtnContainer: {
    borderRadius: 25,
    backgroundColor: '#A9D6B9',
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginText: {
      color: '#355E3B',
    fontFamily: fonts.MontserratRegular,
  },
});