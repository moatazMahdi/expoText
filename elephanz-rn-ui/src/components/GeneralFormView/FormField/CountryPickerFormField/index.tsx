import {
  FormCountryPicker,
} from 'elephanz-rn-ui/src/components/form';
import {
  FieldTypes,
} from 'elephanz-rn-ui/src/components/form/types';
import {
  useFormikContext,
} from 'formik';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  View,
} from 'react-native';
import {
  Country,
} from 'react-native-country-picker-modal';
import {
  FieldPropsCommon,
  CountryPickerFieldValue,
} from '../types';
import {
  onChange,
} from '../utils';

type Props<T> = FieldPropsCommon<T> & CountryPickerFieldValue;

// eslint-disable-next-line max-len
export const CountryPickerFormField = <FormModel extends object>(props: Props<FormModel>) => {
  const {
    values,
    handleChange,
    isSubmitting,
    setFieldTouched,
  } = useFormikContext<FormModel>();

  const {
    location,
    fieldOptions: {
      onValueSelected,
    },
  } = props;
  const onValueChange = onChange(handleChange, location);
  const [currentCountry, setCurrentCountry] = useState({
    callingCode: ['20'],
    cca2: 'EG',
    currency: ['EGP'],
    flag: 'flag-eg',
    name: 'Egypt',
    region: 'Africa',
    subregion: 'Northern Africa',
  } as Country);
  useEffect(() => {
    if (isSubmitting) {
      setFieldTouched(location);
    }
  }, [isSubmitting, location, setFieldTouched]);

  useEffect(() => {
    onValueChange(currentCountry.callingCode[0]);
    if (onValueSelected) {
      onValueSelected(currentCountry.callingCode[0]);
    }
  }, []);

  if (!values) {
    return null;
  }

  return (
    <View>
      <FormCountryPicker
        onPress={() => {}}
        handleChange={(e) => {
          const event: any = e;
          setCurrentCountry(event.target.value);
          onValueChange(event.target.value.callingCode[0]);
          if (onValueSelected) {
            onValueSelected(event.target.value.callingCode[0]);
          }
        }}
        touched={false}
        countryCode={currentCountry.cca2}
        type={FieldTypes.COUNTRY_PICKER_FIELD}
        withFlag={false}
        hasLabel={false}
        label="Code"
        placeholder=""
        value={currentCountry}
      />
    </View>
  );
};
