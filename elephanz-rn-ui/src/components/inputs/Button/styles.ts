import {
  ViewStyle,
} from 'react-native';
import {
  Theme,
} from '../../../theming/Theme';
import {
  ButtonStyles,
} from './types';

const styles = (theme: Theme): ButtonStyles => ({
  button: (disabled, variant, color, size) => {
    let backgroundColor: string;
    let borderColor: string | undefined;
    let minHeight: number;
    let width: string | number | undefined;
    let marginHorizontal: number;
    let marginVertical: number;
    let alignSelf: ViewStyle['alignSelf'];
    if (disabled) {
      if (variant === 'contained') {
        backgroundColor = theme.palette[color].disabledValue;
      } else {
        backgroundColor = theme.palette.common.transparent;
        if (variant === 'outlined') {
          borderColor = theme.palette[color].disabledValue;
        }
      }
    } else if (variant === 'contained') {
      backgroundColor = theme.palette[color].value;
    } else {
      backgroundColor = theme.palette.common.transparent;
      if (variant === 'outlined') {
        borderColor = theme.palette[color].value;
      }
    }
    marginHorizontal = theme.spacing.spacing(1);
    marginVertical = theme.spacing.spacing(1);
    switch (size) {
      case 'small':
        minHeight = theme.spacing.spacing(4);
        break;
      case 'large':
        minHeight = theme.spacing.spacing(12);
        break;
      case 'block':
        alignSelf = 'stretch';
        minHeight = theme.spacing.spacing(8);
        break;
      case 'full':
        marginHorizontal = 0;
        marginVertical = 0;
        width = '100%';
        minHeight = theme.spacing.spacing(6);
        break;
      default:
        minHeight = theme.spacing.spacing(6.25);
        break;
    }
    if (variant === 'outlined') {
      minHeight -= theme.shape.borderWidthStyles.borderBottomWidth + theme.shape.borderWidthStyles.borderTopWidth;
    }
    return {
      ...theme.shape.borderRadiusStyles,
      ...(variant === 'outlined' ? theme.shape.borderWidthStyles : {}),
      backgroundColor,
      borderColor,
      padding: theme.spacing.spacing(1),
      width,
      marginHorizontal,
      marginVertical,
      alignSelf,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight,
    };
  },
});

export default styles;
