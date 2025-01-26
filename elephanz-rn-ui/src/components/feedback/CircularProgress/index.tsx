import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import {
  CircularProgressProps,
} from './types';

export const CircularProgress: React.FC<CircularProgressProps> = (props) => {
  const {
    color = 'primary',
    size = 'large',
    indicatorProps,
  } = props;
  return (
    <ActivityIndicator
      color={color}
      size={size}
      {...(indicatorProps || {})}
    />
  );
};

export * from './types';
