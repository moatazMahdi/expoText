import {
  NativeBase,
} from 'native-base';
import {
  ReactNode,
} from 'react';
import {
  KeyboardTypeOptions,
  ViewProps,
} from 'react-native';
import * as Yup from 'yup';
import {
  TypographyProps,
} from '../dataDisplay';
import {
  ButtonProps,
  DropdownOption,
} from '../inputs';
import {
  TextFieldProps,
} from '../inputs/TextField';
import {
  DropdownFieldValue,
  RadioButtonFieldValue,
  CountryPickerFieldValue,
  ImageFieldValue,
} from './FormField';
import {
  Condition,
} from './Utils';

// eslint-disable-next-line no-shadow
export enum GeneralFormFields {
  INPUT_FIELD = 'inputField',
  DROPDOWN = 'dropdown',
  RADIO_BUTTON = 'radioButton',
  NESTED_FORM = 'nestedForm',
  COUNTRY_PICKER='countryPicker',
  IMAGE='image',
  FIELD_ARRAY = 'fieldArray',
}

export type Props<FormViewModel> = {
  formData: FieldsData<FormViewModel>;
  isLoading?: boolean;
  selectText?: string;
  buttonText?: string;
  onSubmit: (data: FormViewModel) => any;
};

export interface FormCustomPreview<T> {
  component: React.ComponentType<T>;
  rowConfig?: RowConfig;
}

export interface GeneralFormFieldProperties {
  initialValue: any;
  validationSchema: Yup.Schema<any>;
  component: any;
}

export type FieldsData<T, K extends keyof T = keyof T, V = T> = (
  FormFieldData<T, K>
  | FormCustomPreview<V>
  | (FormFieldData<T, K> | FormCustomPreview<V>)[]
)[];

export type FlattenedFieldsData<T, K extends keyof T = keyof T, V = T> = (
  FormFieldData<T, K>
  | FormCustomPreview<V>
)[];

export function isCustomFormPreview<T>(data: any): data is FormCustomPreview<T> {
  return !!(data as FormCustomPreview<T>).component;
}

export function isFormField<T, K extends keyof T = keyof T>(data: any): data is FormFieldData<T, K> {
  return !!(data as FormFieldData<T, K>).key;
}

export type FormDataObject<T> = {
  [K in keyof Partial<T>]: FormFieldData<T, K>;
};

export type InputFieldOptions = {
  textFieldContainerProps?: Partial<ViewProps>;
  textFieldProps?: Partial<TextFieldProps>;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  unit?: string;
  rightTitle?: string;
  rightHint?: ReactNode;
  hint?: string;
};
export type ImageFieldOptions = {
  textFieldContainerProps?: Partial<ViewProps>;
  textFieldProps?: Partial<TextFieldProps>;
};

export interface InputFormField {
  type: GeneralFormFields.INPUT_FIELD;
  fieldOptions: InputFieldOptions;
}
export interface ImageFormField {
  type: GeneralFormFields.IMAGE;
  fieldOptions: ImageFieldOptions;
}

export interface DropdownFieldOptions {
  type?: DropdownTypes;
  multiple?: boolean;
  selectText?: string;
  onSelect?: (value: string) => void;
  options: DropdownOption[];
}

export interface RadioButtonFieldOptions {
  options: string[];
  isHorizontal?: boolean;
}

// eslint-disable-next-line no-shadow
export enum DropdownTypes {
  NORMAL = 'normal',
  PREFIX = 'prefix',
}
export interface DropdownFormField {
  type: GeneralFormFields.DROPDOWN;
  fieldOptions: DropdownFieldOptions;
}

export interface NestedFormFieldOptions<T> {
  formData: FieldsData<T>;
  localSubmit?: NestedFormLocalSubmitButton;
  ValueSubmitted?: React.ReactNode;
}

export interface ImageFormFieldOptions<T> {
  formData: FieldsData<T>;
}

export interface NestedFormLocalSubmitButton {
  onPress: () => void;
  text?: string;
}

export interface NestedFormFormField<T, K extends keyof T> {
  type: GeneralFormFields.NESTED_FORM;
  fieldOptions: NestedFormFieldOptions<T[K]>;
}

export interface FormFieldArrayOptions<T, K extends keyof T> {
  formData: KeylessFormFieldData<T[K] extends unknown[] ? T[K] : any[], number>;
  displayIndex?: boolean;
  displayControllers?: boolean;
  arrayCardProps?: Partial<NativeBase.Card>;
  arrayCardItemProps?: Partial<NativeBase.CardItem>;
  arrayCardItemBodyProps?: Partial<NativeBase.Body>;
  arrayCardItemBodyTypographyEmptyProps?: Partial<TypographyProps>;
  arrayCardItemBodyElementCardProps?: Partial<NativeBase.Card>;
  arrayCardItemBodyElementCardItemHeaderProps?: Partial<NativeBase.Item>;
  arrayCardItemBodyElementCardItemHeaderTypographyProps?: Partial<TypographyProps>;
  arrayCardItemBodyElementCardItemHeaderViewProps?: Partial<ViewProps>;
  arrayCardItemBodyElementCardItemHeaderViewUpButtonProps?: Partial<ButtonProps>;
  arrayCardItemBodyElementCardItemHeaderViewDownButtonProps?: Partial<ButtonProps>;
  arrayCardItemBodyElementCardItemHeaderViewRemoveButtonProps?: Partial<ButtonProps>;
  arrayCardItemBodyElementCardItemProps?: Partial<NativeBase.CardItem>;
  arrayCardItemBodyElementCardItemBodyProps?: Partial<NativeBase.Body>;
  arrayCardItemFooterProps?: Partial<NativeBase.CardItem>;
  arrayCardItemFooterAddButtonProps?: Partial<ButtonProps>;
}

export interface FormFieldArray<T, K extends keyof T> {
  type: GeneralFormFields.FIELD_ARRAY;
  fieldOptions: FormFieldArrayOptions<T, K>;
}

export interface FormDataCommon<T, K extends keyof T = keyof T> extends KeylessFormDataCommon<T, K> {
  key: K;
  rowConfig?: RowConfig;
}

export interface RowConfig {
  flex?: number;
  containerProps?: ViewProps;
}

export interface KeylessFormDataCommon<T, K extends keyof T = keyof T> {
  title: string;
  hasTranslations?: boolean;
  condition?: (values: any, actions: Record<FormFieldActions, () => void>) => Condition;
  validationSchema?: Yup.Schema<T[K]>;
  initialValue?: T[K];
}

// eslint-disable-next-line no-shadow
export enum FormFieldActions {
  ENABLE,
  DISABLE,
  HIDE,
}

// eslint-disable-next-line no-shadow
export enum FormFieldStatus {
  ENABLED,
  DISABLED,
  HIDDEN,
}

export type FormFieldOptions<T, K extends keyof T> = InputFormField
| DropdownFieldValue
| RadioButtonFieldValue
| CountryPickerFieldValue
| ImageFieldValue
| NestedFormFormField<T, K>
| FormFieldArray<T, K>;

export type FormFieldData<
  T,
  K extends keyof T,
  > = FormDataCommon<T, K> & FormFieldOptions<T, K>;
export type KeylessFormFieldData<
  T,
  K extends keyof T,
  > = KeylessFormDataCommon<T, K> & FormFieldOptions<T, K>;
