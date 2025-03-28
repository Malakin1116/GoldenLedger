import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  budgetSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  budgetContainer: {
    flex: 1,
  },
  budgetText: {
    fontSize: 16,
    marginBottom: 10,
  },
  budgetIndicator: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  budgetBar: {
    height: '100%',
  },
  iconButton: {
    marginLeft: 20,
  },
  iconText: {
    fontSize: 24,
  },
});