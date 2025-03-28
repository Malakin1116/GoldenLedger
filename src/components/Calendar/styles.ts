import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  calendarContainer: {
    padding: 20,
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
    fontSize: 18,
    color: '#5a8a9a',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayOfWeek: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  day: {
    width: 40,
    height: 60,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dayEmpty: {
    width: 40,
    height: 60,
    margin: 2,
  },
  dayText: {
    fontSize: 16,
  },
  daySumText: {
    fontSize: 10,
    marginTop: 2,
    color: '#333',
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: '#5a8a9a',
  },
});