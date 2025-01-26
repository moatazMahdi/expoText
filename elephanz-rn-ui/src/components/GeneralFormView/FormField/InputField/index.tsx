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
  TextField,
  TextFieldLabelStyles,
} from '../../../inputs/TextField';
import {
  FieldError,
} from '../../Utils';
import {
  FieldPropsCommon,
  InputFieldValue,
} from '../types';
import {
  onChange,
} from '../utils';

type Props<T> = FieldPropsCommon<T> & InputFieldValue;

// eslint-disable-next-line max-len
export const InputFormField = <FormModel extends object>(props: Props<FormModel>) => {
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
    isPassword,
    keyboardType,
    unit,
    rightTitle,
    hint,
    rightHint,
  } = fieldOptions;

  const value: string = getIn(values, location);
  const onValueChange = onChange(handleChange, location);
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
      <TextField
        value={value}
        disabled={disabled}
        onChange={onValueChange}
        onBlur={() => setFieldTouched(location)}
        label={title}
        labelStyle={TextFieldLabelStyles.STACKED}
        keyboardType={keyboardType}
        isPassword={isPassword}
        unit={unit}
        rightHint={rightHint}
        rightTitle={rightTitle}
        haseErrors={!!error && isTouched}
        hint={hint}
        {...textFieldProps}
      />
      <FieldError
        errors={error}
        touched={isTouched}
      />
    </View>
  );
};
