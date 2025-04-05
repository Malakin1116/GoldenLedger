import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    marginBottom: 30,
    backgroundColor: '#3b5a66',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#E6ECEF',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  categoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTypeButton: {
    backgroundColor: '#5a8a9a',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  categoryTypeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addCategoryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E6ECEF',
    borderRadius: 5,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  deleteCategoryButton: {
    fontSize: 18,
    color: '#FF4D4D',
  },
  noCategoriesText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
});