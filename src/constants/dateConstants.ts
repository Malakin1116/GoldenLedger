// src/constants/dateConstants.ts
export const TABS = ['Day', 'Week', 'Month'] as const;
export type TabType = typeof TABS[number];

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;