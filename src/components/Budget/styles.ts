import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';

export default StyleSheet.create({
  budgetSection: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
    padding: 15,
    width: 365,
  backgroundColor: '#3b5a66',
    borderRadius: 10,
  alignSelf: 'center',
},
budgetContainer: {
  flex: 1,
},
budgetText: {
  fontSize: 16,
  color: '#fff',
  marginBottom: 5,
  fontFamily: fonts.MontserratRegular,
},
budgetIndicator: {
  height: 5,
  backgroundColor: '#555',
  borderRadius: 5,
  overflow: 'hidden',
},
budgetBar: {
  height: '100%',
  borderRadius: 5,
},
iconButton: {
  padding: 10,
},
iconText: {
  fontSize: 24,
  fontFamily: fonts.MontserratRegular,
},
});