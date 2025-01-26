import {
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface StylesInterface {
  mainContainer: ViewStyle;
  containedButton: ViewStyle;
  textButton: ViewStyle;
  outlinedButton: ViewStyle;
  containedButtonText: TextStyle;
  textButtonText: TextStyle;
  outlinedButtonText: TextStyle;
}

export const styles = (theme: Theme): StylesInterface => ({
  mainContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  containedButton: {
    backgroundColor: theme.palette.primary.value,
    borderRadius: theme.shape.borderRadius,
  },
  textButton: {
    backgroundColor: theme.palette.common.transparent,
  },
  outlinedButton: {
    backgroundColor: theme.palette.common.transparent,
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderWidth: theme.shape.borderWidth,
    borderColor: theme.palette.primary.value,
  },
  containedButtonText: {
    color: theme.palette.primary.contrast,
  },
  textButtonText: {
    color: theme.palette.primary.value,
  },
  outlinedButtonText: {
    color: theme.palette.primary.value,
  },
});
