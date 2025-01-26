import {
  TextStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface StylesInterface {
  forgetPassword: TextStyle;
}

export const styles = (theme: Theme): StylesInterface => ({
  forgetPassword: {
    justifyContent: 'center',
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginTop: theme.spacing.spacing(0.625),
    color: theme.palette.common.link,
  },
});
