import {
  KeyboardTypeOptions,
  ReturnKeyType,
  TextStyle,
} from 'react-native';
import {
  BaseFormItemProps,
  FieldTypes,
} from '../types';

export interface TextInputWithErrorsProps extends BaseFormItemProps<string> {
  correctFieldStyle?: TextStyle;
  incorrectFieldStyle?: TextStyle;
  secureTextEntry?: boolean;
  returnKeyType?: ReturnKeyType;
  selectTextOnFocus?: boolean;
  clearTextOnFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  type: FieldTypes.TEXT_FIELD;
}
