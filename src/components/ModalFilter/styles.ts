import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: '80%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: '#E6ECEF', // Як у календарі для звичайних днів
    borderWidth: 1,
    borderColor: 'rgba(70, 127, 127, 0.3)', // Легкий бірюзовий для рамки
  },
  selectedCategoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: 'rgb(160, 226, 226)', // Як у календарі для обраного дня
    borderWidth: 1,
    borderColor: 'rgba(70, 127, 127, 1)', // Темно-бірюзовий для рамки
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: 'rgba(70, 127, 127, 1)', // Темно-бірюзовий для заголовків
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(70, 127, 127, 1)',
    paddingBottom: 3,
  },
  scrollFade: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'transparent',
  },
  allButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#E6ECEF', // Як у календарі для звичайних днів
    borderWidth: 1,
    borderColor: 'rgba(70, 127, 127, 0.3)',
  },
  selectedAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: 'rgb(160, 226, 226)', // Як у календарі для обраного дня
    borderWidth: 1,
    borderColor: 'rgba(70, 127, 127, 1)',
    shadowColor: 'rgba(70, 127, 127, 1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(70, 127, 127, 1)', // Темно-бірюзовий, як у календарі
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'rgba(70, 127, 127, 1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
