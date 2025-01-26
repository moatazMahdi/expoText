import {
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  screenContainer: ViewStyle;
  bodyContainer: ViewStyle;
  scrollView: ViewStyle;
  scrollViewContentContainer: ViewStyle;
  bottomCardContainer: ViewStyle;
}

export const styles = (theme: Theme): Styles => ({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.palette.background.value,
  },
  bodyContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {},
  scrollViewContentContainer: {
    flexDirection: 'column',
    minHeight: '100%',
  },
  bottomCardContainer: {
    width: '100%',
    left: theme.spacing.spacing(0),
    bottom: theme.spacing.spacing(0),
    overflow: 'hidden',
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 0.23,
  },
});
