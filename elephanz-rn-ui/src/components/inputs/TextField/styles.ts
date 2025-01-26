import { Theme } from '../../../theming';
import { TextFieldLabelStyles, TextFieldStyles } from './types';

export const defaultStyles = (theme: Theme): TextFieldStyles => {
  const {
    shape: { borderRadiusStyles, borderWidthStyles },
    palette: { others, error },
    spacing: { spacing }
  } = theme;
  return {
    itemStyle: (labelStyle) => {
      if (labelStyle === TextFieldLabelStyles.FLOATING) {
        return {
          ...borderRadiusStyles,
          ...borderWidthStyles,
          borderColor: theme.palette.primary.value,
          marginLeft: 0
        };
      }
      return {
        borderBottomWidth: 0,
        marginLeft: 0
      };
    },
    labelStyle: (labelStyle) => {
      if (labelStyle === TextFieldLabelStyles.FLOATING) {
        return {
          paddingLeft: Math.max(borderRadiusStyles.borderBottomLeftRadius, borderRadiusStyles.borderTopLeftRadius)
        };
      }
      return {};
    },
    rightHint: {
      position: 'absolute',
      bottom: spacing(-3),
      right: 0
    },
    eye: {
      height: spacing(3),
      width: spacing(3),
      position: 'absolute',
      top: spacing(6.5),
      right: spacing(1.5)
    },
    unit: {
      position: 'absolute',
      right: spacing(2)
    },
    rightTitle: {
      fontSize: spacing(1.5)
      // // lineHeight: spacing(3.5),
    },
    hint: {
      width: '100%',
      marginTop: spacing(0.5)
    },
    errorIcon: {
      height: spacing(3),
      width: spacing(3),
      position: 'absolute',
      top: spacing(6),
      right: spacing(1.5)
    },
    inputStyle: (labelStyle) => {
      if (labelStyle !== TextFieldLabelStyles.FLOATING) {
        return {
          ...borderRadiusStyles,
          ...borderWidthStyles,
          marginTop:
            labelStyle === TextFieldLabelStyles.STACKED ? theme.spacing.spacing(1.25) : theme.spacing.spacing(0),
          paddingLeft: spacing(2.5),
          borderColor: others.inputBorder,
          borderWidth: 1,
          height: spacing(7),
          borderRadius: spacing(3.5),
          paddingRight: spacing(2.5),
          marginLeft: spacing(1)
        };
      }
      return {
        paddingLeft: Math.max(borderRadiusStyles.borderBottomLeftRadius, borderRadiusStyles.borderTopLeftRadius)
      };
    },
    error: (haserrors) => {
      if (haserrors) {
        return {
          borderColor: error.value
        };
      }
      return {};
    }
  };
};
