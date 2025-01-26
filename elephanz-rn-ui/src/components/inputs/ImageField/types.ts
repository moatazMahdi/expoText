import {
  NativeBase,
} from 'native-base';
import {
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {
  ThemedStyles,
} from '../../types';
import {
  TextFieldLabelStyles,
} from '../TextField';
import {
  BaseFieldProps,
} from '../types';

export interface TextFieldStyles {
  itemStyle: (labelStyle: TextFieldLabelStyles) => ViewStyle;
  labelStyle: (labelStyle: TextFieldLabelStyles) => TextStyle;
  inputStyle: (labelStyle: TextFieldLabelStyles) => ViewStyle;
  container: ViewStyle;
  icon: ViewStyle;
  imageContainer: ViewStyle;
  image: ImageStyle;
  header: ViewStyle;
  trash: ImageStyle;
  error: (haseErrors: boolean) => ViewStyle;
  errorIcon: ViewStyle;
}

export interface ImageFieldProps extends BaseFieldProps<ImageInfo> {
  itemProps?: Partial<NativeBase.Item>;
  labelProps?: Partial<NativeBase.Label>;
  inputProps?: Partial<NativeBase.Input>;
  haseErrors?: boolean;
  styles?: ThemedStyles<TextFieldStyles>;
  labelStyle?: TextFieldLabelStyles;
}

export interface ImageInfo {
  uri: string;
  imageData?: {
    fileType: string;
    fileBase64: string;
  };
}
