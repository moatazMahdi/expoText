import {
  DropdownFieldOptions,
  FormFieldArrayOptions,
  GeneralFormFields,
  InputFieldOptions,
  NestedFormFieldOptions,
  RadioButtonFieldOptions,
  ImageFieldOptions,
} from '../types';

export type FieldProps<T, K extends keyof T> = FieldPropsCommon<T> & (
  InputFieldValue
  | NestedFormFieldValue<T, K>
  | ArrayFormFieldFieldValue<T, K>
  | DropdownFieldValue
  | ImageFieldValue
  | RadioButtonFieldValue
  | CountryPickerFieldValue
);

export type FieldPropsTypes<T, K extends keyof T> = (
  (FieldPropsCommon<T> & InputFieldValue)
  | (FieldPropsCommon<T> & NestedFormFieldValue<T, K>)
  | (FieldPropsCommon<T> & ArrayFormFieldFieldValue<T, K>)
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldPropsCommon<T> {
  title: string;
  location: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface InputFieldValue {
  type: GeneralFormFields.INPUT_FIELD;
  fieldOptions: InputFieldOptions;
}

export interface ImageFieldValue {
  type: GeneralFormFields.IMAGE;
  fieldOptions: InputFieldOptions;
}

export interface DropdownFieldValue {
  type: GeneralFormFields.DROPDOWN;
  fieldOptions: DropdownFieldOptions;
}

export interface RadioButtonFieldValue {
  type: GeneralFormFields.RADIO_BUTTON;
  fieldOptions: RadioButtonFieldOptions;
}

export interface CountryPickerFieldValue {
  type: GeneralFormFields.COUNTRY_PICKER;
  fieldOptions: CountryPickerFieldOptions;
}
export interface CountryPickerFieldOptions {
  onValueSelected?: (value: string) => void;
}

export function isInputProps<
  T,
  K extends keyof T,
  >(props: FieldProps<T, K>): props is FieldPropsCommon<T> & InputFieldValue {
  return props.type === GeneralFormFields.INPUT_FIELD;
}

export function isDropdownProps<
  T,
  K extends keyof T,
  >(props: FieldProps<T, K>): props is FieldPropsCommon<T> & DropdownFieldValue {
  return props.type === GeneralFormFields.DROPDOWN;
}
export function isImageProps<
  T,
  K extends keyof T,
  >(props: FieldProps<T, K>): props is FieldPropsCommon<T> & ImageFieldValue {
  return props.type === GeneralFormFields.IMAGE;
}

export interface NestedFormFieldValue<T, K extends keyof T> {
  type: GeneralFormFields.NESTED_FORM;
  fieldOptions: NestedFormFieldOptions<T[K]>;
}

export function isNestedFormProps<
  T,
  K extends keyof T,
  >(props: FieldProps<T, K>): props is FieldPropsCommon<T> & NestedFormFieldValue<T, K> {
  return props.type === GeneralFormFields.NESTED_FORM;
}

export interface ArrayFormFieldFieldValue<T, K extends keyof T> {
  type: GeneralFormFields.FIELD_ARRAY;
  fieldOptions: FormFieldArrayOptions<T, K>;
}

export interface ImageFormFieldFieldValue {
  type: GeneralFormFields.IMAGE;
  fieldOptions: ImageFieldOptions;
}

export function isArrayProps<
  T,
  K extends keyof T,
  >(props: FieldProps<T, K>): props is FieldPropsCommon<T> & ArrayFormFieldFieldValue<T, K> {
  return props.type === GeneralFormFields.FIELD_ARRAY;
}
