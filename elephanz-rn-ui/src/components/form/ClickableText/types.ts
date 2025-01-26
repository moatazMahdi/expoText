import {
  TextStyle,
} from 'react-native';

export interface Props {
  style?: TextStyle;
  onPress: () => void;
  text: string;
  disabled?: boolean;
}
