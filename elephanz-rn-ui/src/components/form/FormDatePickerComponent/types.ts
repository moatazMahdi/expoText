import {
  ImageStyle,
} from 'react-native';
import {
  BaseFormItemProps,
  FieldTypes,
} from '../types';

export interface DatePickerProps extends BaseFormItemProps<Date | string> {
  pickerImage?: number;
  pickerImageStyle?: ImageStyle;
  format: string;
  minDate: string | Date;
  maxDate: string | Date;
  cancelBtnText: string;
  confirmBtnText: string;
  mode: 'date' | 'time' | 'datetime';
  onPress: () => void;
  type: FieldTypes.DATE_PICKER_FIELD;
}
