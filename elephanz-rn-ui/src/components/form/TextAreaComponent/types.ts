import {
  ReturnKeyType,
  TextStyle,
} from 'react-native';
import {
  BaseFormItemProps,
  FieldTypes,
} from '../types';

export interface TextAreaComponentProps extends BaseFormItemProps<string> {
  correctFieldStyle?: TextStyle;
  incorrectFieldStyle?: TextStyle;
  secureTextEntry?: boolean;
  returnKeyType?: ReturnKeyType;
  selectTextOnFocus?: boolean;
  clearTextOnFocus?: boolean;
  rowSpan: number;
  type: FieldTypes.TEXT_AREA_FIELD;
  bordered: boolean;
  underline: boolean;
}
