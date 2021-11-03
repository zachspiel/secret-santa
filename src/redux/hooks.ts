import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppQuery = () => new URLSearchParams(useLocation().search);
