import { Platform, StyleSheet } from 'react-native';
import {fonts} from '../../constants/fonts';
export default StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderRadius: 25,
        marginVertical: 4,
        paddingHorizontal: 24,
        borderColor: '#355E3B',
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
      },
});
