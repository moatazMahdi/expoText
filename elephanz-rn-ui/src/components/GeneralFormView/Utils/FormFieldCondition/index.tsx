import {
  useFormikContext,
} from 'formik';
import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {
  FORM_FIELDS,
} from '../../constants';
import {
  FormFieldActions,
  FormFieldStatus,
} from '../../types';
import {
  FormFieldConditionProps,
} from './types';

export const FormFieldCondition = <T, K extends keyof T>(props: PropsWithChildren<FormFieldConditionProps<T, K>>) => {
  const [status, setStatus] = useState<FormFieldStatus>(FormFieldStatus.ENABLED);
  const formFieldActions: Record<FormFieldActions, () => void> = {
    [FormFieldActions.DISABLE]: () => setStatus(FormFieldStatus.DISABLED),
    [FormFieldActions.ENABLE]: () => setStatus(FormFieldStatus.ENABLED),
    [FormFieldActions.HIDE]: () => setStatus(FormFieldStatus.HIDDEN),
  };

  const {
    values,
  } = useFormikContext();

  const {
    fieldData: {
      title,
      type,
      condition,
      fieldOptions,
    },
    location,
  } = props;
  useEffect(() => {
    if (values && condition) {
      condition(values, formFieldActions).execute();
    }
  }, [condition, formFieldActions, values]);

  if (status === FormFieldStatus.HIDDEN) {
    return null;
  }

  const newProps: any = {
    title,
    location,
    fieldOptions,
    type,
    disabled: status === FormFieldStatus.DISABLED,
  };

  const Component = FORM_FIELDS[type].component as any;

  return (
    <Component
      {...newProps}
    />
  );
};

export * from './types';
