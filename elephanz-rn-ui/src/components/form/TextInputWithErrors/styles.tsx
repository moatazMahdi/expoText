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
    marginVertical: theme.spacing.spacing(0.625),
    borderColor: theme.palette.primary.value,
  },
  inputFieldStyleCorrect: {
    height: theme.spacing.spacing(5),
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    borderColor: theme.palette.surface.contrast,
    paddingHorizontal: theme.spacing.spacing(2),
    color: theme.palette.surface.contrast,
  },
  inputFieldStyleIncorrect: {
    height: theme.spacing.spacing(5),
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    borderColor: theme.palette.error.value,
    paddingHorizontal: theme.spacing.spacing(2),
    color: theme.palette.surface.contrast,
  },
  errorContainer: {
    paddingHorizontal: theme.spacing.spacing(2),
    height: theme.spacing.spacing(2),
  },
  inputError: {
    ...theme.typography.subtitle1,
    color: theme.palette.error.value,
  },
  inputWithLableStyle: {
    marginVertical: theme.spacing.spacing(0.625),
    flexDirection: 'row',
    // width: '70%',
    alignContent: 'stretch',
    borderColor: theme.palette.surface.contrast,
  },
  labelContainerStyle: {
    width: '30%',
    alignSelf: 'center',
    paddingLeft: theme.spacing.spacing(2.5),
    color: theme.palette.primary.contrast,
  },
});
