import {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';

export interface Styles {
  dropdownArrowContainer: ViewStyle;
  dropdownImage: ImageStyle;
  errorContainer: ViewStyle;
  inputError: TextStyle;
  pickerContainerActiveStyle: ViewStyle;
  pickerContainerInactiveStyle: ViewStyle;
  pickerWithLableStyle?: ViewStyle;
  inputWithLableStyle: ViewStyle;
  labelContainerStyle: ViewStyle;
  pickerContainerStyle: ViewStyle;
}

export const styles = (theme: Theme): Styles => ({
  dropdownArrowContainer: {
    position: 'absolute',
    right: theme.spacing.spacing(0),
    width: theme.spacing.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownImage: {
    resizeMode: 'contain',
    width: theme.spacing.spacing(2),
    height: theme.spacing.spacing(2),
  },
  errorContainer: {
    paddingHorizontal: theme.spacing.spacing(2),
    height: theme.spacing.spacing(1.5),
  },
  inputError: {
    ...theme.typography.subtitle1,
  },
  pickerContainerActiveStyle: {
    flex: 1,
    flexDirection: 'row',
    height: theme.spacing.spacing(5),
    borderWidth: theme.shape.borderWidth,
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing.spacing(1),
  },
  pickerContainerInactiveStyle: {
    flex: 1,
    flexDirection: 'row',
    height: theme.spacing.spacing(5),
    borderWidth: theme.shape.borderWidth,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing.spacing(1),
  },
  inputWithLableStyle: {
    marginVertical: theme.spacing.spacing(0.625),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderColor: theme.palette.primary.value,
  },
  labelContainerStyle: {
    width: '30%',
    paddingLeft: theme.spacing.spacing(2.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pickerWithLableStyle: {
    display: 'flex',
    flexDirection: 'row',
  },
  pickerContainerStyle: {
    // borderColor: theme.palette.borderColor,
    borderWidth: theme.shape.borderWidth,
    borderColor: theme.palette.surface.contrast,
    height: theme.spacing.spacing(5.625),
    // borderBottomWidth: 1,
    borderTopLeftRadius: theme.shape.SelectRadius(theme.shape.borderTopLeftRadius),
    borderTopRightRadius: theme.shape.SelectRadius(theme.shape.borderTopRightRadius),
    borderBottomLeftRadius: theme.shape.SelectRadius(theme.shape.borderBottomLeftRadius),
    borderBottomRightRadius: theme.shape.SelectRadius(theme.shape.borderBottomRightRadius),
    borderBottomWidth: theme.shape.SelectWidth(theme.shape.borderBottomWidth),
    borderTopWidth: theme.shape.SelectWidth(theme.shape.borderTopWidth),
    borderLeftWidth: theme.shape.SelectWidth(theme.shape.borderLeftWidth),
    borderRightWidth: theme.shape.SelectWidth(theme.shape.borderRightWidth),
    // borderRadius: 30,
    // paddingHorizontal: 16,
    paddingHorizontal: theme.spacing.spacing(2),
  },
});
