import {
  FormikHelpers,
  FormikProps,
  FormikValues,
} from 'formik';
import React from 'react';
import * as yup from 'yup';

export interface Props<T extends FormikValues = FormikValues> {
  initialFormValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: yup.ObjectSchema<yup.Shape<object, any>>;
  validateOnChange: boolean;
  validateOnBlur: boolean;
  children: (
    formikBag: FormikProps<T>,
  ) => React.ReactChild;
}
