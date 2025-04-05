import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(70, 127, 127, 1)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Календар зліва, дата в центрі, серце справа
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center', // Центруємо дату і стрілочки
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
    marginHorizontal: 10, // Відступи для стрілочок
  },
  arrowButton: {
    padding: 5,
  },
  arrowText: {
    fontSize: 20,
    color: '#fff',
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
  scrollContainer: {
    flex: 1,
  },
  daySection: {
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(33, 67, 67, 0.35)',
    borderRadius: 10,
  },
  daySectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  budgetSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3b5a66',
    borderRadius: 10,
    marginTop: 10,
  },
  budgetContainer: {
    flex: 1,
  },
  budgetText: {
    fontSize: 16,
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  disabledArrow: {
    opacity: 0.3, // Зменшуємо видимість для відключеної стрілки
  },
  disabledArrowText: {
    color: '#888', // Сірий колір для тексту відключеної стрілки
  },
});
