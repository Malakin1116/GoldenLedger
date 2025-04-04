// src/utils/navigateUtil.ts
import { NavigationProp } from '@react-navigation/native';
import { RootStackNavigation } from '../navigation/types';

type NavigateParams<T extends keyof RootStackNavigation> = RootStackNavigation[T] extends undefined
  ? [screen: T]
  : [screen: T, params: RootStackNavigation[T]];

export const navigateUtil = <T extends keyof RootStackNavigation>(
  navigation: NavigationProp<RootStackNavigation>,
  ...args: NavigateParams<T>
) => {
  const [screen, params] = args;
  navigation.navigate(screen as string, params);
};