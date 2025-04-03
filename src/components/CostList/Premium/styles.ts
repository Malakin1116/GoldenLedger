import { StyleSheet } from 'react-native';
import {fonts} from '../../../constants/fonts';

export default StyleSheet.create({
  listContainer: {
    backgroundColor: 'rgba(249, 95, 95, 0.4)', // Фон, объединяющий список и summary
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,// Отступ снизу для разделения от следующего блока
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 10,
    marginBottom: 5,// Уменьшаем промежуток между элементами
    backgroundColor: 'rgba(249, 95, 95, 0.32)',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
     fontFamily: fonts.MontserratRegular,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 18,
     fontFamily: fonts.MontserratRegular,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
     fontFamily: fonts.MontserratRegular,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgb(68, 135, 135)',
    borderRadius: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
     fontFamily: fonts.MontserratRegular,
  },
});