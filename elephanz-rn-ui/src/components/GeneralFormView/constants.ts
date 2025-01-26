import * as Yup from 'yup';
import {
  ArrayFormField,
  InputFormField,
  NestedFormField,
  DropdownFormField,
} from './FormField';
import {
  CountryPickerFormField,
} from './FormField/CountryPickerFormField';
import {
  ImageFormField,
} from './FormField/ImageField';
import {
  RadioButtonFormField,
} from './FormField/RadioButtonFormField';
import {
  GeneralFormFields,
} from './types';

export const FORM_FIELDS = {
  [GeneralFormFields.INPUT_FIELD]: {
    initialValue: '',
    validationSchema: Yup.string().required(),
    component: InputFormField,
  },
  [GeneralFormFields.NESTED_FORM]: {
    initialValue: {},
    validationSchema: Yup.object().required(),
    component: NestedFormField,
  },
  [GeneralFormFields.FIELD_ARRAY]: {
    initialValue: [],
    validationSchema: Yup.array().required().min(1),
    component: ArrayFormField,
  },
  [GeneralFormFields.DROPDOWN]: {
    initialValue: '',
    validationSchema: Yup.string().required(),
    component: DropdownFormField,
  },
  [GeneralFormFields.RADIO_BUTTON]: {
    initialValue: '',
    validationSchema: Yup.string().required(),
    component: RadioButtonFormField,
  },
  [GeneralFormFields.COUNTRY_PICKER]: {
    initialValue: '',
    validationSchema: Yup.string().required(),
    component: CountryPickerFormField,
  },
  [GeneralFormFields.IMAGE]: {
    initialValue: '',
    validationSchema: Yup.string().required(),
    component: ImageFormField,
  },
} as const;
