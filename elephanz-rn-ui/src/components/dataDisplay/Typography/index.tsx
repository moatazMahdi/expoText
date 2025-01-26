import React from 'react';
import { Text } from 'react-native';
import defaultStyles from './styles';
import {
  TypographyProps,
  TypographyColors,
  TypographyColorVariant,
} from './types';
import { useStyles, Theme } from '../../../theming';
import { useTheme } from '../../../theming/utils/useTheme';
import { hp, wp } from 'src/utils/Dimensions/dimen';

const selectColor = (
  theme: Theme,
  color: TypographyColors | string,
  variant: TypographyColorVariant,
  isCustom: boolean,
) => {
  if (isCustom) {
    return theme.palette.others[color];
  }

  if (
    color === 'black' ||
    color === 'white' ||
    color === 'transparent' ||
    color === 'link' ||
    color === 'grey'
  ) {
    return theme.palette.common[color];
  }
  if (variant === 'main') {
    return (theme.palette as any)[color].value;
  }
  if (variant === 'contrast') {
    return (theme.palette as any)[color].contrast;
  }
  if (variant === 'disabled') {
    return (theme.palette as any)[color].disabledValue;
  }
  return (theme.palette as any)[color].disabledContrast;
};

const selectVariant = (theme: Theme, variant: string, isCustom: boolean) => {
  if (isCustom) {
    return (theme.typography.others as any)[variant];
  }
  return (theme.typography as any)[variant];
};

export const Typography: React.FC<TypographyProps> = (props) => {
  const {
    children,
    variant = 'body1',
    customStyles,
    color = 'primary',
    colorVariant = 'main',
    colorHex,
    fontSize = hp(14),
    numberOfLines = 100,
    ellipsizeMode = 'tail',
    isCustomVariant = false,
    textAlign = 'left',
    textTransform,
    isCustomColor = false,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    fontWeight,
    adjustsFontSizeToFit,
    onPress,
    onTextLayout,
    marginEnd,
    style,
  } = props;
  const { selectStyle } = useStyles(defaultStyles, customStyles);
  const { theme } = useTheme();
  return (
    <Text
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      onPress={onPress}
      ellipsizeMode={ellipsizeMode}
      style={[
        selectVariant(theme, variant, isCustomVariant).value,
        {
          color: selectColor(theme, color, colorVariant, isCustomColor),
          textAlign,
          textTransform,
        },
        fontSize && { fontSize: fontSize },
        marginTop && { marginTop: hp(marginTop) },
        marginBottom && { marginBottom: hp(marginBottom) },
        marginLeft && { marginLeft: wp(marginLeft) },
        marginRight && { marginRight: wp(marginRight) },
        marginEnd && { marginEnd: wp(marginEnd) },
        fontWeight && { fontWeight: fontWeight },
        { color: theme.palette.common.darkBlue },
        selectStyle('text'),
        colorHex && {
          color: colorHex,
        },
        style,
      ]}
      onTextLayout={onTextLayout}
    >
      {children}
    </Text>
  );
};

export * from './types';
