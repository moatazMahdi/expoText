/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
} from 'elephanz-rn-ui/src/components/inputs';
import {
  getIn,
  useFormikContext,
} from 'formik';
import {
  merge,
} from 'lodash';
import {
  Body,
  Card,
  CardItem,
} from 'native-base';
import React,
{
  PropsWithChildren,
} from 'react';
import {
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  Typography,
} from '../../../dataDisplay';
import {
  FlattenedFieldsData,
  isCustomFormPreview,
  isFormField,
} from '../../types';
import {
  FieldError,
  FormFieldCondition,
} from '../../Utils';
import {
  FieldPropsCommon,
  NestedFormFieldValue,
} from '../types';

type Props<T, K extends keyof T> = FieldPropsCommon<T> & NestedFormFieldValue<T, K>;

interface FormFieldProps<FormModel> {
  formField: FlattenedFieldsData<FormModel>[number];
  location: string;
  values: FormModel;
}

const FormField = <
  FormModel,
  FormModelKey extends keyof FormModel,
  >(props: PropsWithChildren<FormFieldProps<FormModel>>) => {
  const {
    formField,
    location,
    values,
  } = props;
  return (
    <View
      style={{
        flex: formField.rowConfig && formField.rowConfig.flex ? formField.rowConfig.flex : undefined,
      }}
    >
      {(() => {
        if (isCustomFormPreview<FormModel>(formField)) {
          const CustomComponent = formField.component as any;
          return (
            <CustomComponent {...values} />
          );
        }
        if (isFormField<FormModel, FormModelKey>(formField)) {
          return (
            <FormFieldCondition<FormModel, FormModelKey>
              key={`${location}.${formField.key}`}
              fieldData={formField as any}
              location={`${location}.${formField.key}`}
            />
          );
        }
        return null;
      })()}
    </View>
  );
};

// eslint-disable-next-line max-len
export const NestedFormField = <FormModel, FormModelKey extends keyof FormModel>(props: Props<FormModel, FormModelKey>) => {
  const {
    values,
    errors,
    touched,
  } = useFormikContext<FormModel>();

  const {
    fieldOptions,
    title,
    location,
  } = props;

  const {
    localSubmit,
    formData: unflattenedFormData,
    ValueSubmitted,
  } = fieldOptions;

  const error = getIn(errors, location);
  const isTouched = getIn(touched, location);

  return (
    <Card style={{
      width: '100%',
      elevation: 0,
      borderColor: 'transparent',
      borderWidth: 0,
    }}
    >
      {!!title && (
        <CardItem header>
          <Typography>{title}</Typography>
        </CardItem>
      )}
      <CardItem
        style={{
          backgroundColor: '#F5F5F582',
          borderRadius: 10,
        }}
      >
        <Body
          style={{
            padding: 8,
          }}
        >
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
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
                        <FormField<FormModel, FormModelKey>
                          formField={rowEntry as any}
                          location={location}
                          values={values}
                        />
                      )))}
                    </View>
                  );
                }
                return (
                  <FormField
                    formField={formEntry as any}
                    location={location}
                    values={values}
                  />
                );
              })
            }
            {localSubmit?.onPress && (
              <Button
                size="full"
                onPress={localSubmit.onPress}
              >
                <Typography
                  variant="button"
                  color="white"
                >
                  {localSubmit.text || 'Submit'}
                </Typography>
              </Button>
            )}
          </View>
        </Body>
      </CardItem>
      <CardItem
        footer
        style={{
          height: 24,
        }}
      >
        <FieldError
          errors={error}
          touched={isTouched}
        />
      </CardItem>
      {ValueSubmitted}
    </Card>
  );
};

/* eslint-enable @typescript-eslint/no-explicit-any */
