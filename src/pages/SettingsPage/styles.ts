import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(70, 127, 127, 1)',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  section: {
    marginTop: 100,
    marginBottom: 30,
    backgroundColor: '#3b5a66',
    padding: 15,
    borderRadius: 10,
  },
  headerWithLanguage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
    backgroundColor: '#E6ECEF',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#5a8a9a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#5a8a9a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportButton: {
    backgroundColor: '#5a8a9a',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
  languageContainer: {
    position: 'relative',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 5,
  },
  languageArrow: {
    fontSize: 16,
    color: '#fff',
  },
  languageDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#5a8a9a',
    borderRadius: 5,
    padding: 5,
    zIndex: 1,
    minWidth: 120,
  },
  languageOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  checkBox: {
    width: 20,
    height: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAllButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 25, // Зменшуємо відступ знизу, щоб кнопки були ближче
    opacity: 0.8,
    width: '50%', // Зменшуємо ширину кнопки до 60% від контейнера
   alignSelf: 'flex-start',
  },
  deleteAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
});