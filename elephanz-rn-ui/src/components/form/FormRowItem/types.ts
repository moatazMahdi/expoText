import {
  ViewStyle,
} from 'react-native';

export interface FormRowItemProps {
  style?: ViewStyle;
  isLast: boolean;
  children: React.ReactNode;
}
