import React from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {
  ButtonProps,
  ButtonVariants,
} from './types';
import {
  CircularProgress,
} from '../../feedback/CircularProgress';
import {
  Typography,
} from '../../dataDisplay';
import {
  useStyles,
} from '../../../theming';
import defaultStyles from './styles';
import {
  TypographyColorVariant,
} from '../../dataDisplay/Typography/types';

const selectColorVariant = (
  disabled: boolean,
  buttonVariant: ButtonVariants,
): TypographyColorVariant => {
  if (disabled) {
    if (buttonVariant === 'contained') {
      return 'disabledContrast';
    }
    return 'disabled';
  }
  if (buttonVariant === 'contained') {
    return 'contrast';
  }
  return 'main';
};

export const Button: React.FC<
ButtonProps
> = (props) => {
  const {
    onPress,
    disabled = false,
    isLoading = false,
    color = 'primary',
    variant = 'contained',
    size = 'medium',
    children,
    customStyles,
    touchableOpacityProps,
    progressProps,
  } = props;
  const {
    selectStyle,
  } = useStyles(defaultStyles, customStyles);
  const fixedChildren = typeof children === 'string'
    ? (
      <Typography
        variant="button"
        color={color}
        colorVariant={selectColorVariant(disabled || isLoading, variant)}
      >
        {children}
      </Typography>
    )
    : children;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.75}
      style={selectStyle('button', [disabled, variant, color, size])}
      {...(touchableOpacityProps || {})}
    >
      {isLoading ? <CircularProgress {...(progressProps || {})} /> : fixedChildren}
    </TouchableOpacity>
  );
};

export * from './types';
