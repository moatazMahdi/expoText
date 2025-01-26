import {
  FormikErrors,
  FormikTouched,
} from 'formik';
import React from 'react';
import {
  View,
} from 'react-native';
import {
  useTheme,
} from '../../../../theming';
import {
  Typography,
} from '../../../dataDisplay';
import {
  FieldErrorProps,
} from './types';

const getTouched = (touched: FormikTouched<any>): boolean => {
  let isTouched = false;
  if (Array.isArray(touched)) {
    if (!touched.length) {
      isTouched = false;
    } else {
      isTouched = false;
    }
  } else if (typeof touched === 'boolean') {
    isTouched = touched;
  } else {
    isTouched = false;
  }
  return isTouched;
};

const getError = (errors: FormikErrors<any>): string => {
  let error = '';
  if (Array.isArray(errors)) {
    if (!errors.length) {
      error = '';
    } else if (typeof errors[0] === 'string') {
      [error] = errors;
    } else {
      error = '';
    }
  } else if (typeof errors === 'string') {
    error = errors;
  } else {
    error = '';
  }
  return error;
};

export const FieldError: React.FC<FieldErrorProps> = (props) => {
  const {
    errors,
    touched,
  } = props;
  const error = getError(errors);
  const isTouched = getTouched(touched);
  const {
    theme,
  } = useTheme();
  if (!error || !isTouched) {
    return (
      <View
        style={{
          height: theme.spacing.spacing(3),
        }}
      />
    );
  }
  return (
    <View
      style={{
        height: theme.spacing.spacing(3),
        marginTop: theme.spacing.spacing(1),
      }}
    >
      <Typography
        variant="subtitle2"
        color="error"
      >
        {error}
      </Typography>
    </View>
  );
};

export * from './types';
