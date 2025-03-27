import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
  },
  actionButtonText: {
    fontSize: 18,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3b5a66',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#5a8a9a',
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});