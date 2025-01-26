import {
  Theme,
} from '../../../theming';
import {
  TextFieldLabelStyles,
} from '../TextField';
import {
  TextFieldStyles,
} from './types';

export const defaultStyles = (theme: Theme): TextFieldStyles => {
  const {
    shape: {
      borderRadiusStyles,
      borderWidthStyles,
    },
    palette: {
      others,
      error,
    },
    spacing: {
      spacing,
    },
  } = theme;
  return {
    itemStyle: (labelStyle) => {
      if (labelStyle === TextFieldLabelStyles.FLOATING) {
        return {
          ...borderRadiusStyles,
          ...borderWidthStyles,
          borderColor: theme.palette.primary.value,
          marginLeft: 0,
        };
      }
      return {
        borderBottomWidth: 0,
        marginLeft: 0,
      };
    },
    labelStyle: (labelStyle) => {
      if (labelStyle === TextFieldLabelStyles.FLOATING) {
        return {
          paddingLeft: Math.max(borderRadiusStyles.borderBottomLeftRadius, borderRadiusStyles.borderTopLeftRadius),
        };
      }
      return {
        color: others.title,
      };
    },
    container: {
      width: '100%',
      height: spacing(6.875),
      borderColor: others.border,
      borderWidth: 1,
      borderRadius: spacing(3.5),
      marginTop: spacing(2),
    },
    image: {
      height: '100%',
      width: '100%',
    },
    errorIcon: {
      height: spacing(3),
      width: spacing(3),
      position: 'absolute',
      top: spacing(7),
      right: spacing(1.5),
    },
    error: (haserrors) => {
      if (haserrors) {
        return {
          borderColor: error.value,
        };
      }
      return {};
    },
    icon: {
      height: spacing(3),
      width: spacing(3),
      alignSelf: 'flex-end',
      marginTop: spacing(1.75),
      marginHorizontal: spacing(1.75),
    },
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
    },
    trash: {
      height: spacing(3),
      width: spacing(3),
    },
    imageContainer: {
      height: spacing(20.5),
      width: '100%',
      borderWidth: 1,
      borderRadius: spacing(3.5),
      marginTop: spacing(1.5),
      borderColor: others.border,
    },
    inputStyle: (labelStyle) => {
      if (labelStyle !== TextFieldLabelStyles.FLOATING) {
        return {
          ...borderRadiusStyles,
          ...borderWidthStyles,
          borderColor: theme.palette.primary.value,
          marginTop: labelStyle === TextFieldLabelStyles.STACKED
            ? theme.spacing.spacing(1)
            : theme.spacing.spacing(0),
          paddingLeft: Math.max(borderRadiusStyles.borderBottomLeftRadius, borderRadiusStyles.borderTopLeftRadius),
        };
      }
      return {
        paddingLeft: Math.max(borderRadiusStyles.borderBottomLeftRadius, borderRadiusStyles.borderTopLeftRadius),
      };
    },
  };
};
