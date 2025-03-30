import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(70, 127, 127, 1)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
  },
  dateText: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#3b5a66',
  },
  activeTab: {
    backgroundColor: '#5a8a9a',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
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
    marginBottom: 5, // Добавляем небольшой отступ снизу
  },
  budgetIndicator: {
    height: 5, // Высота полоски
    backgroundColor: '#555', // Серый фон для индикатора
    borderRadius: 5,
    overflow: 'hidden', // Чтобы полоска не выходила за границы
  },
  budgetBar: {
    height: '100%',
    borderRadius: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Устанавливаем высокий zIndex, чтобы быть поверх всех элементов
  },
});