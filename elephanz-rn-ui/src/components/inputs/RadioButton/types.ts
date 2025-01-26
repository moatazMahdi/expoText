import {
  NativeBase,
} from 'native-base';
import {
  ReactText,
} from 'react';
import {
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  BaseFieldProps,
} from '../types';

export interface RadioButtonStyles {
  itemStyle: (labelStyle: TextFieldLabelStyles) => ViewStyle;
  labelStyle: (labelStyle: TextFieldLabelStyles) => TextStyle;
  outerBullet: ViewStyle;
  innerBullet: ViewStyle;
  container: ViewStyle;
  text: TextStyle;
  content: ViewStyle;
  option: ViewStyle;
}

export interface RadioButtonProps extends BaseFieldProps<string | string[]> {
  itemProps?: Partial<NativeBase.Item>;
  labelProps?: Partial<NativeBase.Label>;
  inputProps?: Partial<NativeBase.Input>;
  labelStyle?: TextFieldLabelStyles;
  options: string[];
  isHorizontal?: boolean;
  onChange: (value: ReactText | string[]) => void;
}

export enum TextFieldLabelStyles {
  FIXED = 'fixedLabel',
  INLINE = 'inlineLabel',
  STACKED = 'stackedLabel',
  FLOATING = 'floatingLabel',
}
