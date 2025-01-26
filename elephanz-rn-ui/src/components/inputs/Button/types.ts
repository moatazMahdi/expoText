import {
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import {
  CircularProgressProps,
} from '../../feedback/CircularProgress';
import {
  Theme,
} from '../../../theming';

export type ButtonVariants = 'contained' | 'text' | 'outlined';

export type ButtonColors = 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';

export type ButtonSizes = 'small' | 'medium' | 'large' | 'block' | 'full';

export interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariants;
  color?: ButtonColors;
  size?: ButtonSizes;
  isLoading?: boolean;
  touchableOpacityProps?: TouchableOpacityProps;
  progressProps?: CircularProgressProps;
  customStyles?: (theme: Theme) => Partial<ButtonStyles>;
}

export interface ButtonStyles {
  button: (disabled: boolean, variant: ButtonVariants, color: ButtonColors, size: ButtonSizes) => ViewStyle;
}
