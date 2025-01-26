import {
  ViewStyle,
} from 'react-native';

export interface Props {
  mode: 'time' | 'date' | 'datetime' | undefined;
  placeholder: string;
  format: string;
  minDate: Date;
  maxDate: Date;
  confirmBtnText: string;
  cancelBtnText: string;
  onDateChange: (date: Date) => void;
  hasLabel?: boolean;
  label?: string;
  inputWithLableStyle?: ViewStyle;
}
