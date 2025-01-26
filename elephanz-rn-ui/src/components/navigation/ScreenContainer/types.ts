import {
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Props {
  headerRender?: React.ReactNode;
  bottomCard?: BottomCardProps;
  contentContainerStyle?: ViewStyle;
  keyboardExtraHeight?: number;
  CurrentTheme?: Theme;
}

export interface BottomCardProps {
  render: React.ReactNode;
  height: number;
}
