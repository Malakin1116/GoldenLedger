import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
  },
  activeTab: {
    backgroundColor: '#4A4A4A',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
  activeTabText: {
    color: '#FFF',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#000',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 14,
    color: '#FFF',
  },
  budgetSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 10,
    padding: 16,
  },
  budgetText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default styles;
