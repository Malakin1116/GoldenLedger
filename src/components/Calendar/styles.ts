import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  calendarContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'rgba(70, 127, 127, 1)',
    height: 415,
    position: 'relative',
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
    color: '#fff',
  },
  arrow: {
    fontSize: 24,
    color: '#fff',
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
    color: '#fff',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    height: 335, // Фіксована висота для 5 рядків (5 * (50 + 2 + 2))
  },
  day: {
    width: (width - 40 - 6 * 6) / 7,
    height: 50,
    marginHorizontal: 1,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#E6ECEF',
  },
  dayEmpty: {
    width: (width - 40 - 6 * 6) / 7,
    height: 50,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 18,
    color: '#000000',
  },
  daySumText: {
    fontSize: 12,
    marginTop: 2,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: 'rgb(160, 226, 226)',
  },
  disabledDay: {
    backgroundColor: 'rgba(144, 209, 209, 0.2)',
  },
  filterButton: {
    position: 'absolute',
    bottom: 10, // Відступ від низу контейнера (paddingBottom)
    right: 25, // Відступ від правого краю (paddingRight)
    width: (width - 40 - 6 * 6) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
   backgroundColor: 'rgba(70, 127, 127, 1)',
  },
  filterText: {
    fontSize: 20,
    color: '#fff',
  },
});