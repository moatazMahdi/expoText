import {
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  textInputContainer: ViewStyle;
  inputFieldStyleCorrect: TextStyle;
  inputFieldStyleIncorrect: TextStyle;
  errorContainer: ViewStyle;
  inputError: TextStyle;
  inputWithLableStyle: ViewStyle;
  labelContainerStyle: TextStyle;
}

export const styles = (theme: Theme): Styles => ({
  textInputContainer: {
    marginVertical: theme.spacing.spacing(0.56),
    borderColor: theme.palette.surface.contrast,
  },
  inputFieldStyleCorrect: {
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    padding: theme.spacing.spacing(2),
  },
  inputFieldStyleIncorrect: {
    borderColor: theme.palette.error.value,
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    padding: theme.spacing.spacing(2),
  },
  errorContainer: {
    paddingHorizontal: theme.spacing.spacing(2),
    height: theme.spacing.spacing(1.5),
  },
  inputError: {
    ...theme.typography.subtitle1,
    color: theme.palette.error.value,
  },
  inputWithLableStyle: {
    marginVertical: theme.spacing.spacing(0.56),
    flexDirection: 'column',
    alignContent: 'stretch',
    borderColor: theme.palette.primary.value,
  },
  labelContainerStyle: {
    width: '30%',
    alignSelf: 'flex-start',
    paddingLeft: theme.spacing.spacing(2.5),
    color: theme.palette.primary.contrast,
  },
});
