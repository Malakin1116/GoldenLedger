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
  dateText: {
    fontSize: 24,
    color: '#fff',
  },
  iconButton: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
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
    backgroundColor: '#3b5a66',
    borderRadius: 10,
  },
  daySectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3b5a66',
    borderRadius: 10,
    marginTop: 10,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});