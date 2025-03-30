import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  calendarContainer: {
  paddingTop: 20,
  paddingBottom: 10,
  paddingLeft: 20,
  paddingRight: 20,
  backgroundColor: 'rgba(70, 127, 127, 1)',
},
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 24,
    color: '#000000',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayOfWeek: {
    width: (width - 40) / 7,
    textAlign: 'center',
    fontSize: 12,
    color: '#000000',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  day: {
    width: (width - 40 - 6 * 6) / 7,
    height: 60,
    marginHorizontal: 1,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#E6ECEF',
  },
  dayEmpty: {
    width: (width - 40 - 6 * 6) / 7,
    height: 60,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 18,
    color: '#000000', // Базовий колір, який буде перезаписаний через getDayTextColor
  },
  daySumText: {
    fontSize: 12,
    marginTop: 2,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: 'rgb(160, 226, 226)',
  },
});