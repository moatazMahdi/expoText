/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Formik,
  FormikProps,
} from 'formik';
import {
  flatten,
  merge,
} from 'lodash';
import {
  Form,
} from 'native-base';
import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import * as Yup from 'yup';
import {
  useTheme,
} from '../../theming';
import {
  Typography,
} from '../dataDisplay';
import {
  Button,
} from '../inputs';
import {
  FORM_FIELDS,
} from './constants';
import {
  GeneralFormFields,
  FieldsData,
  FormFieldData,
  isCustomFormPreview,
  isFormField,
  Props,
  FlattenedFieldsData,
} from './types';
import {
  FormFieldCondition,
} from './Utils';

export const generateInitialValues = <
  FormViewModel,
  >(
    value: FormFieldData<FormViewModel, keyof FormViewModel>,
    key?: keyof FormViewModel,
    mappedStoreData?: FormViewModel,
    isCurrentlyEditting = false,
  ): FormViewModel[keyof FormViewModel] => {
  if (isCurrentlyEditting && mappedStoreData && key) {
    return mappedStoreData[key];
  }
  if (value.initialValue) {
    return value.initialValue;
  }
  let initValue = (FORM_FIELDS[value.type].initialValue as unknown) as (FormViewModel[keyof FormViewModel]);
  if (value.type === GeneralFormFields.NESTED_FORM) {
    const newInitValue: Record<keyof FormViewModel, FormViewModel[keyof FormViewModel]> = {} as any;
    value.fieldOptions.formData
      ?.filter((formEntry) => !isCustomFormPreview(formEntry))
      ?.forEach((formEntry) => {
        if (isFormField<FormViewModel, keyof FormViewModel>(formEntry)) {
          const innerKey = (formEntry.key as keyof FormViewModel);
          const innerValue = formEntry as FormFieldData<FormViewModel, keyof FormViewModel>;
          newInitValue[innerKey] = generateInitialValues(innerValue);
        }
      });
    initValue = newInitValue as any;
  }
  return initValue;
};

function generateValidationSchema<
  FormViewModel,
  >(value: FormFieldData<FormViewModel, keyof FormViewModel>): Yup.Schema<any> {
  let schema: Yup.Schema<any>;
  if (value.validationSchema) {
    schema = value.validationSchema;
  } else {
    schema = FORM_FIELDS[value.type].validationSchema;
  }
  if (value.type === GeneralFormFields.FIELD_ARRAY) {
    schema = (schema.clone() as Yup.ArraySchema<any>).of(generateValidationSchema(value.fieldOptions.formData as any));
  } else if (value.type === GeneralFormFields.NESTED_FORM) {
    // eslint-disable-next-line max-len
    const newValidationSchema: Record<keyof FormViewModel, Yup.Schema<any>> = {} as Record<keyof FormViewModel, Yup.Schema<any>>;
    value.fieldOptions.formData
      ?.filter((formEntry) => !isCustomFormPreview(formEntry))
      ?.forEach((formEntry) => {
        if (isFormField<FormViewModel, keyof FormViewModel>(formEntry)) {
          const innerKey = (formEntry.key as keyof FormViewModel);
          const innerValue = formEntry as FormFieldData<FormViewModel, keyof FormViewModel>;
          newValidationSchema[innerKey] = generateValidationSchema(innerValue).clone();
        }
      });
    schema = Yup.object(newValidationSchema);
  }
  return schema;
}

const processFormData = <
  FormViewModel,
  >(formData: FieldsData<FormViewModel>, mappedStoreData: any, isCurrentlyEditting = false) => {
  // eslint-disable-next-line max-len
  const newValidationSchema: Record<keyof FormViewModel, Yup.Schema<any>> = {} as Record<keyof FormViewModel, Yup.Schema<any>>;
  const newInitialValues: FormViewModel = {} as FormViewModel;
  formData
    ?.filter((formEntry) => !isCustomFormPreview(formEntry))
    ?.forEach((formEntry) => {
      if (isFormField<FormViewModel, keyof FormViewModel>(formEntry)) {
        const {
          key,
        } = formEntry;
        const value = formEntry;
        newValidationSchema[key] = generateValidationSchema(value).clone();
        newInitialValues[key] = generateInitialValues(value, key, mappedStoreData, isCurrentlyEditting);
      }
    });
  return {
    validationSchema: Yup.object(newValidationSchema),
    initialValues: newInitialValues,
  };
};

interface FormFieldProps<FormViewModel> {
  formEntry: FlattenedFieldsData<FormViewModel>[number];
  formikBag: FormikProps<FormViewModel>;
}

const FormField = <
  FormViewModel,
  >(props: PropsWithChildren<FormFieldProps<FormViewModel>>) => {
  const {
    formEntry,
    formikBag,
  } = props;
  return (
    <View
      style={{
        flex: formEntry.rowConfig && formEntry.rowConfig.flex ? formEntry.rowConfig.flex : undefined,
      }}
    >
      {(() => {
        if (isCustomFormPreview(formEntry)) {
          const CustomComponent = formEntry.component;
          return (
            <CustomComponent {...formikBag.values} />
          );
        }
        if (isFormField<FormViewModel, keyof FormViewModel>(formEntry)) {
          const {
            key,
          } = formEntry;
          const value = formEntry;
          if (!formikBag.values || formikBag.values[key] === undefined) {
            return null;
          }
          return (
            <FormFieldCondition<FormViewModel, keyof FormViewModel>
              key={`${key}`}
              fieldData={value}
              location={`${key}`}
            />
          );
        }
        return null;
      })()}
    </View>
  );
};

export const GeneralFormView = <
  FormViewModel,
  >(props: PropsWithChildren<Props<FormViewModel>>) => {
  const {
    formData: unflattenedFormData,
    onSubmit,
    buttonText,
    isLoading,
  } = props;
  const {
    theme,
  } = useTheme();

  const formData = flatten(unflattenedFormData);

  const [initialValues, setInitialValues] = useState<FormViewModel>();
  const [validationSchema, setValidationSchema] = useState<Yup.Schema<any>>();

  useEffect(() => {
    const onMount = async () => {
      const isCurrentlyEditting = false;

      let mappedStoreData;

      if (isCurrentlyEditting) {
        setInitialValues(mappedStoreData);
      }
    };
    onMount();
  }, [props]);

  useEffect(() => {
    const onMount = () => {
      const isCurrentlyEditting = false;

      let mappedStoreData;

      const {
        validationSchema: newValidationSchema,
        initialValues: newInitialValues,
      } = processFormData(formData, mappedStoreData, isCurrentlyEditting);
      setValidationSchema(newValidationSchema);
      setInitialValues(newInitialValues);
    };
    onMount();
  }, [props]);

  return (
    <Formik
      initialValues={initialValues || {} as FormViewModel}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {
        (formikBag) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: theme.spacing.spacing(1),
            }}
          >
            {
              unflattenedFormData?.map((formEntry) => {
                if (Array.isArray(formEntry)) {
                  if (!formEntry.length) {
                    return null;
                  }
                  let containerProps: ViewProps = {};
                  if (formEntry[0].rowConfig && formEntry[0].rowConfig.containerProps) {
                    containerProps = formEntry[0].rowConfig.containerProps;
                  }
                  let style: ViewStyle = {
                    flexDirection: 'row',
                  };
                  if (containerProps.style) {
                    style = merge(style, containerProps.style);
                  }
                  return (
                    <View
                      {...containerProps}
                      style={style}
                    >
                      {(formEntry?.map((rowEntry) => (
                        <FormField
                          formEntry={rowEntry}
                          formikBag={formikBag}
                        />
                      )))}
                    </View>
                  );
                }
                return (
                  <FormField
                    formEntry={formEntry}
                    formikBag={formikBag}
                  />
                );
              })
            }
            <Button
              variant="contained"
              onPress={formikBag.handleSubmit}
              color="primary"
              size="full"
              customStyles={() => ({
                button: () => ({
                  height: 50,
                  marginTop: 40,
                }),
              })}
              isLoading={isLoading}
              progressProps={{
                color: 'white',
                size: 'small',
              }}
            >
              <Typography
                isCustomColor
                color={theme.palette.background.contrast}
              >
                {buttonText || 'Submit'}
              </Typography>
            </Button>
          </Form>
        )
      }
    </Formik>
  );
};

export * from './constants';
export * from './types';
export * from './validations';
export * from './Utils';

/* eslint-enable @typescript-eslint/no-explicit-any */
