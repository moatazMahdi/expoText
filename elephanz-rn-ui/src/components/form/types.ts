import {
  FormikErrors,
  FormikTouched,
} from 'formik';
import {
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface BaseFormItemProps<T> {
  style?: ViewStyle;
  placeholder: string;
  activeTextStyle?: TextStyle;
  inactiveTextStyle?: TextStyle;
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;
  value: T;
  onChange?: (value: T) => void;
  handleChange: (e: React.ChangeEvent<any> | string) => void;
  onSubmitEditing?: () => void;
  errorsStyle?: TextStyle;
  onBlur?: () => void;
  onFocus?: () => void;
  hasLabel?: boolean;
  label?: string;
  inputWithLableStyle?: ViewStyle;
  index?: number;
  focusedIndex?: number;
  focusOnNext?: () => void;
}

// eslint-disable-next-line no-shadow
export enum FieldTypes {
  TEXT_FIELD = 'textInput',
  PICKER_FIELD = 'picker',
  DATE_PICKER_FIELD = 'datePicker',
  BOTTOM_BUTTON_FIELD = 'bottomScreenButton',
  TEXT_AREA_FIELD = 'textArea',
  COUNTRY_PICKER_FIELD = 'countryPicker',
}

export interface FakeEvent {
  target: {
    value: any;
  };
}
