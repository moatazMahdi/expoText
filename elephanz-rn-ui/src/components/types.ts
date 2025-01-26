import {
  Theme,
} from '../theming';

export type ThemedStyles<T> = (theme: Theme) => Partial<T>;
