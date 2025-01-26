import {
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  rowItem: ViewStyle;
  lastRowItem: ViewStyle;
}

export const styles = (theme: Theme): Styles => ({
  rowItem: {
    flex: 1,
    marginRight: theme.spacing.spacing(2),
  },
  lastRowItem: {
    marginRight: theme.spacing.spacing(0),
  },
});
