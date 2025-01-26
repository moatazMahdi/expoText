import {
  ActivityIndicatorProps,
} from 'react-native';

export type CircularProgressSizes = 'small' | 'large';

export interface CircularProgressProps {
  color?: string;
  size?: CircularProgressSizes;
  indicatorProps?: ActivityIndicatorProps;
}
