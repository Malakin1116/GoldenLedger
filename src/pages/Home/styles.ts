import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3f47',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#3b5a66',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    fontSize: 14,
    color: '#ccc',
    width: '14.28%', // 100% / 7
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  day: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayEmpty: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedDay: {
    backgroundColor: '#5a8a9a',
    borderRadius: 5,
  },
  summaryContainer: {
    backgroundColor: '#3b5a66',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  todayText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#5a8a9a',
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  sumText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  budgetSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3b5a66',
    borderRadius: 10,
  },
  budgetContainer: {
    flex: 1,
  },
  budgetText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
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
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});