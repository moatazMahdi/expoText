import {
  ImageField,
} from 'elephanz-rn-ui/src/components/inputs/ImageField';
import {
  getIn,
  useFormikContext,
} from 'formik';
import React, {
  useEffect,
} from 'react';
import {
  View,
} from 'react-native';
import {
  TextFieldLabelStyles,
} from '../../../inputs/TextField';
import {
  FieldError,
} from '../../Utils';
import {
  FieldPropsCommon,
  ImageFieldValue,
} from '../types';
import {
  onChange,
} from '../utils';

type Props<T> = FieldPropsCommon<T> & ImageFieldValue;

// eslint-disable-next-line max-len
export const ImageFormField = <FormModel extends object>(props: Props<FormModel>) => {
  const {
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
  } = useFormikContext<FormModel>();

  const {
    disabled,
    title,
    location,
    fieldOptions,
  } = props;

  const {
    textFieldContainerProps,
    textFieldProps,
  } = fieldOptions;

  const value: any = getIn(values, location);
  const onValueChange: any = onChange(handleChange, location);
  const error = getIn(errors, location);
  const isTouched = getIn(touched, location);

  useEffect(() => {
    if (isSubmitting) {
      setFieldTouched(location);
    }
  }, [isSubmitting, location, setFieldTouched]);

  if (!values) {
    return null;
  }

  return (
    <View
      style={{
        width: '100%',
      }}
      {...textFieldContainerProps}
    >
      <ImageField
        value={value}
        disabled={disabled}
        onChange={onValueChange}
        onBlur={() => setFieldTouched(location)}
        label={title}
        labelStyle={TextFieldLabelStyles.STACKED}
        haseErrors={!!error && isTouched}
        {...textFieldProps}
      />
      <FieldError
        errors={error}
        touched={isTouched}
      />
    </View>
  );
};
