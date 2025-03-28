import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  todayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#5a8a9a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sumText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});