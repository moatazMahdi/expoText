import {
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  pickerContainer: ViewStyle;
}

export const styles = (theme: Theme): Styles => ({
  pickerContainer: {
    flexDirection: 'row',
    marginVertical: theme.spacing.spacing(0.625),
  },
});
