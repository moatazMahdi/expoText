import {
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  correctPickerStyle: ViewStyle;
  incorrectPickerStyle: ViewStyle;
  inputError: TextStyle;
  inputWithLableStyle: ViewStyle;
  textInputContainer: ViewStyle;
  labelContainerStyle: TextStyle;
  countryPickerContainer: ViewStyle;
  callingCode: TextStyle;
}

export const styles = (theme: Theme): Styles => ({
  correctPickerStyle: {
    flexDirection: 'row',
    height: theme.spacing.spacing(4.5),
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.palette.surface.contrast,
  },
  incorrectPickerStyle: {
    flexDirection: 'row',
    height: theme.spacing.spacing(4.5),
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.palette.error.value,
  },
  inputError: {
    ...theme.typography.subtitle1,
    marginLeft: theme.spacing.spacing(2.5),
  },
  inputWithLableStyle: {
    marginVertical: theme.spacing.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
  },
  textInputContainer: {
    marginVertical: theme.spacing.spacing(0.625),
  },
  labelContainerStyle: {
    width: '30%',
    alignSelf: 'center',
    paddingLeft: theme.spacing.spacing(3.657),
    color: theme.palette.primary.contrast,
  },
  countryPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: theme.palette.surface.contrast,
  },
  callingCode: {
    ...theme.typography.subtitle1,
    marginHorizontal: theme.spacing.spacing(1.25),
    color: theme.palette.primary.contrast,
  },
});
