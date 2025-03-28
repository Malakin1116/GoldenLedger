import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  calendarContainer: {
    padding: 20,
    backgroundColor: 'rgba(97, 163, 163, 0.40)',
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
    
    color: '#5a8a9a',
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
    color: '#666',
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
    borderWidth: 2,
    borderColor: '#5a8a9a',
  },
});