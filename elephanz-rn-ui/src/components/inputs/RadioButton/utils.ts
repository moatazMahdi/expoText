import {
  TextFieldLabelStyles,
} from './types';

export const getItemLabelProp = <T extends TextFieldLabelStyles>(labelStyle: T): Record<T, true> => ({
  [labelStyle as T]: true,
} as any);
