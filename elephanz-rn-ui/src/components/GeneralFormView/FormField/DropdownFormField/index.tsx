import React, { useEffect } from 'react';
import { View } from 'react-native';
import { getIn, useFormikContext } from 'formik';
import { DropdownFieldValue, FieldPropsCommon } from '../types';
import { FieldError } from '../../Utils';
import DefaultDropdown from 'src/components/DefaultDropdown';

type Props<T> = FieldPropsCommon<T> & DropdownFieldValue;

// eslint-disable-next-line max-len
export const DropdownFormField = <FormModel extends object>(
  props: Props<FormModel>,
) => {
  const { values, errors, touched, isSubmitting, setFieldTouched } =
    useFormikContext<FormModel>();

  const {
    title,
    location,
    fieldOptions: { options, onSelect },
  } = props;

  const value: string = getIn(values, location);
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
      <DefaultDropdown
        data={options}
        value={value}
        placeholder={title}
        onChange={onSelect}
      />
      <FieldError errors={error} touched={isTouched} />
    </View>
  );
};
