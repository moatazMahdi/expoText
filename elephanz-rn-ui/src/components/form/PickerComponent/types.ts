import {
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  BaseFormItemProps,
  FieldTypes,
} from '../types';

export interface PickerItem {
  label: string;
  value: any;
}

export interface PickerProps extends BaseFormItemProps<any> {
  isPickerActive: boolean; // Whether the state of the picker is active or not (active in UI)
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textActiveColor?: string;
  textInactiveColor?: string;
  pickerContainerActiveStyle?: ViewStyle;
  pickerContainerInactiveStyle?: ViewStyle;
  pickerItems: PickerItem[];
  isPickerEnabled: boolean; // Whether the picker can or cannot be opened
  pickerWithLableStyle?: ViewStyle;
  type: FieldTypes.PICKER_FIELD;
}

// export interface PickerProps<T> extends BaseFormItemProps<T> {
//   isPickerActive: boolean; // Whether the state of the picker is active or not (active in UI)
//   placeholder: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   textActiveColor?: string;
//   textInactiveColor?: string;
//   pickerContainerActiveStyle?: ViewStyle;
//   pickerContainerInactiveStyle?: ViewStyle;
//   pickerItems: PickerItem<T>[];
//   isPickerEnabled: boolean; // Whether the picker can or cannot be opened
//   pickerWithLableStyle?: ViewStyle;
//   type: FieldTypes.PICKER_FIELD;

// }

export interface PropStylesInterface {
  activePickerText: TextStyle;
  inactivePickerText: TextStyle;
  activePickerPlaceholder: TextStyle;
  inactivePickerPlaceholder: TextStyle;
}
