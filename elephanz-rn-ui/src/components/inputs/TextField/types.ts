import {
  NativeBase,
} from 'native-base';
import {
  ReactNode,
} from 'react';
import {
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {
  ThemedStyles,
} from '../../types';
import {
  BaseFieldProps,
} from '../types';

// eslint-disable-next-line no-shadow
export enum TextFieldLabelStyles {
  FIXED = 'fixedLabel',
  INLINE = 'inlineLabel',
  STACKED = 'stackedLabel',
  FLOATING = 'floatingLabel',
}

export interface TextFieldStyles {
  itemStyle: (labelStyle: TextFieldLabelStyles) => ViewStyle;
  labelStyle: (labelStyle: TextFieldLabelStyles) => TextStyle;
  inputStyle: (labelStyle: TextFieldLabelStyles) => ViewStyle;
  error: (haseErrors: boolean) => ViewStyle;
  eye: ViewStyle;
  errorIcon: ViewStyle;
  unit: TextStyle;
  rightTitle: TextStyle;
  hint: TextStyle;
  rightHint: ViewStyle;
}

export interface TextFieldProps extends BaseFieldProps<string> {
  itemProps?: Partial<NativeBase.Item>;
  labelProps?: Partial<NativeBase.Label>;
  isPassword?: boolean;
  inputProps?: Partial<NativeBase.Input>;
  styles?: ThemedStyles<TextFieldStyles>;
  labelStyle?: TextFieldLabelStyles;
  keyboardType?: KeyboardTypeOptions;
  unit?: string;
  rightTitle?: string;
  haseErrors?: boolean;
  rightHint: ReactNode;
  hint?: string;
}
