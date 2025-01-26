import { Theme } from '../../../theming';
import { TextFieldLabelStyles } from '../TextField';
import { RadioButtonStyles } from './types';

export const defaultStyles = (theme: Theme): RadioButtonStyles => {
  const {
    shape: { borderRadiusStyles, borderWidthStyles },
    spacing: { spacing },
    palette: { primary, others }
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
      return {
        color: others.title
      };
    },
    container: {
      width: '100%',
      marginTop: 14
    },
    option: {
      flexDirection: 'row'
    },
    content: {
      flex: 1
    },
    innerBullet: {
      height: 12,
      width: 12,
      borderRadius: 6,
      alignSelf: 'center',
      backgroundColor: primary.value
    },
    outerBullet: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: primary.value,
      justifyContent: 'center',
      marginRight: 10
    },
    text: {
      fontSize: spacing(2)
      // // lineHeight: 18,
    }
  };
};
