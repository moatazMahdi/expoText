import {
  FormikErrors,
  FormikTouched,
} from 'formik';

export interface FieldErrorProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
}
