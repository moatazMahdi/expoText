import {
  FormFieldData,
} from '../../types';

export interface FormFieldConditionProps<T, K extends keyof T> {
  fieldData: FormFieldData<T, K>;
  location: string;
}
