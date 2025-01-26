import {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  headerContainer: ViewStyle;
  buttonImageContainer: ViewStyle;
  buttonImage: ImageStyle;
  textContainerStyle: ViewStyle;
  textStyle: TextStyle;
}

export const styles = (theme: Theme): Styles => ({
  headerContainer: {
    height: theme.spacing.spacing(7.5),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.value,
  },
  buttonImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    height: theme.spacing.spacing(2),
    width: theme.spacing.spacing(3.5),
    resizeMode: 'contain',
  },
  textContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
  },
});
