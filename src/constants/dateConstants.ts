// src/constants/dateConstants.ts
export const MONTHS = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
] as const;

export const TABS = ['Day', 'Week', 'Month'] as const;
export type TabType = typeof TABS[number];