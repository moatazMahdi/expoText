import {
  BottomScreenButtonProps,
} from '../BottomScreenButton/types';
import {
  CountryPickerProps,
} from '../../inputs/FormCountryPicker/types';
import {
  DatePickerProps,
} from '../FormDatePickerComponent/types';
import {
  PickerProps,
} from '../PickerComponent/types';
import {
  TextAreaComponentProps,
} from '../TextAreaComponent/types';
import {
  TextInputWithErrorsProps,
} from '../TextInputWithErrors/types';

export type FormItemProps =
  TextInputWithErrorsProps
  | PickerProps
  | DatePickerProps
  | BottomScreenButtonProps
  | TextAreaComponentProps
  | CountryPickerProps;

export function isTextInput(
  formItem: FormItemProps,
): formItem is TextInputWithErrorsProps {
  return formItem.type === 'textInput';
}

export function isPicker(formItem: FormItemProps): formItem is PickerProps {
  return formItem.type === 'picker';
}

export function isDatePicker(
  formItem: FormItemProps,
): formItem is DatePickerProps {
  return formItem.type === 'datePicker';
}

export function isBottomScreenButton(
  formItem: FormItemProps,
): formItem is BottomScreenButtonProps {
  return formItem.type === 'bottomScreenButton';
}

export function isTextArea(formItem: FormItemProps): formItem is TextAreaComponentProps {
  return formItem.type === 'textArea';
}

export function isCountryPicker(
  formItem: FormItemProps,
): formItem is CountryPickerProps {
  return formItem.type === 'countryPicker';
}
