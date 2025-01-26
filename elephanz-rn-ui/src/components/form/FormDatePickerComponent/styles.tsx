import {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  correctPickerStyle: ViewStyle;
  incorrectPickerStyle: ViewStyle;
  pickerImage: ImageStyle;
  pickerText: TextStyle;
  pickerActiveText: TextStyle;
  inputError: TextStyle;
  inputWithLableStyle: ViewStyle;
  labelContainerStyle: ViewStyle;
  pickerContainerStyle: ViewStyle;
  dateContainer: ViewStyle;
  textActiveStyle: TextStyle;
  textInactiveStyle: TextStyle;
}

export const styles = (theme: Theme): Styles => ({
  correctPickerStyle: {
    flexDirection: 'row',
    height: theme.spacing.spacing(5.5),
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderColor: theme.palette.surface.contrast,
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
  },
  incorrectPickerStyle: {
    flexDirection: 'row',
    height: theme.spacing.spacing(4.5),
    borderWidth: theme.shape.borderWidth,
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: theme.palette.error.value,
  },
  pickerImage: {
    marginLeft: theme.spacing.spacing(6.875),
    width: theme.spacing.spacing(3.5),
    height: theme.spacing.spacing(3.5),
  },
  pickerText: {
    ...theme.typography.subtitle1,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.spacing(2),
  },
  pickerActiveText: {
    ...theme.typography.subtitle1,
    justifyContent: 'flex-end',
  },
  inputError: {
    fontSize: theme.spacing.spacing(1.5),
    marginLeft: theme.spacing.spacing(3.657),
    color: theme.palette.error.value,
  },
  inputWithLableStyle: {
    marginVertical: theme.spacing.spacing(0.625),
    flexDirection: 'row',
    alignContent: 'stretch',
  },
  labelContainerStyle: {
    width: '30%',
    alignSelf: 'center',
    paddingLeft: theme.spacing.spacing(3.657),
  },
  pickerContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  dateContainer: {
    display: 'none',
  },
  textActiveStyle: {
    color: theme.palette.primary.contrast,
    paddingHorizontal: theme.spacing.spacing(2),

  },
  textInactiveStyle: {
    color: theme.palette.error.value,
  },
});
