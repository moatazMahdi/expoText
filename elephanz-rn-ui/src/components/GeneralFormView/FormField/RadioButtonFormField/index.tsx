import {
  TextFieldLabelStyles,
} from 'elephanz-rn-ui/src/components/inputs';
import {
  RadioButton,
} from 'elephanz-rn-ui/src/components/inputs/RadioButton';
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
  FieldError,
} from '../../Utils';
import {
  RadioButtonFieldValue,
  FieldPropsCommon,
} from '../types';
import {
  onChange,
} from '../utils';

type Props<T> = FieldPropsCommon<T> & RadioButtonFieldValue;

// eslint-disable-next-line max-len
export const RadioButtonFormField = <FormModel extends object>(props: Props<FormModel>) => {
  const {
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
  } = useFormikContext<FormModel>();

  const {
    title,
    location,
    fieldOptions: {
      options,
      isHorizontal,
    },
  } = props;

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
    <View>
      <RadioButton
        options={options}
        onChange={onValueChange}
        value={value}
        isHorizontal={isHorizontal}
        label={title}
        labelStyle={TextFieldLabelStyles.STACKED}
      />
      <FieldError
        errors={error}
        touched={isTouched}
      />
    </View>
  );
};
