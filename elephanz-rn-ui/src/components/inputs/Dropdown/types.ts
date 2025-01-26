import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface DropdownStyles {
  chevron: ImageStyle;
  dropdown: ViewStyle;
  itemText: TextStyle;
  itemStyle: ViewStyle;
  container: ViewStyle;
  defaultText: TextStyle;
}

export interface DropdownProps {
  data: DropdownOption[];
  value: any;
  onChange: (value: string) => void;
  setIsOpened?: any;
  placeholder?: string;
  openArrowIcon?: React.FunctionComponent<SvgProps>;
  closeArrowIcon?: React.FunctionComponent<SvgProps>;
  isRequired?: boolean;
  textColor?: string;
  disabled?: boolean;
  dropDownStyle?: any;
  buttonTextStyle?: any;
  SelectedItemObject?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export enum TextFieldLabelStyles {
  FIXED = 'fixedLabel',
  INLINE = 'inlineLabel',
  STACKED = 'stackedLabel',
  FLOATING = 'floatingLabel',
}
