// useAppDispatch.ts
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector.ts
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAppSelector = useSelector.withTypes<RootState>();