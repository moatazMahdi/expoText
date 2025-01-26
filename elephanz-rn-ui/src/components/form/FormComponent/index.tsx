import {
  Formik,
  FormikValues,
} from 'formik';
import React, {
  PropsWithChildren,
  useState,
} from 'react';
import {
  mapFlat,
} from 'react-children-addons';
import {
  FormItem,
} from '../FormItem/index';
import {
  FormItemProps,
} from '../FormItem/types';
import {
  FormRowProps,
} from '../FormRow/types';
import {
  Props,
} from './types';

export const FormComponent = <T extends FormikValues>(props: PropsWithChildren<Props<T>>) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const focusOnNext = () => {
    setFocusedIndex(focusedIndex + 1);
  };
  const {
    initialFormValues,
    onSubmit,
    validationSchema,
    validateOnChange,
    validateOnBlur,
    children,
  } = props;
  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
    >
      {(formikBag) => {
        let index = -1;
        const flattened = mapFlat(children(formikBag), (formItemsOrRows) => {
          formItemsOrRows = formItemsOrRows as React.ReactElement<FormItemProps | FormRowProps>;
          if (formItemsOrRows.type === FormItem) {
            index += 1;
            return React.cloneElement(formItemsOrRows, {
              index,
              focusedIndex,
              focusOnNext,
            });
          }
          const newFormRowItems = mapFlat(formItemsOrRows.props.children, (formRowItem) => {
            const newFormRowItem = React.cloneElement(formRowItem as any);
            const formItems = mapFlat(newFormRowItem.props.children, (formItem) => {
              index += 1;
              return React.cloneElement(formItem as any, {
                index,
                focusedIndex,
                focusOnNext,
              });
            });
            return React.cloneElement(newFormRowItem, {
              children: formItems,
            });
          });
          return React.cloneElement(formItemsOrRows, {
            children: newFormRowItems,
          });
        });
        return flattened;
      }}
    </Formik>
  );
};
