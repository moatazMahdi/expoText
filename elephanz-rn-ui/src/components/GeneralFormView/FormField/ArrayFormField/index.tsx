/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getIn,
  useFormikContext,
} from 'formik';
import {
  Body,
  Card,
  CardItem,
} from 'native-base';
import React, {
  useEffect,
} from 'react';
import {
  View,
} from 'react-native';
import {
  generateInitialValues,
} from '../..';
import {
  Typography,
} from '../../../dataDisplay';
import {
  Button,
} from '../../../inputs';
import {
  FieldError,
  FormFieldCondition,
} from '../../Utils';
import {
  ArrayFormFieldFieldValue,
  FieldPropsCommon,
} from '../types';
import {
  onChange,
} from '../utils';

type Props<T, K extends keyof T> = FieldPropsCommon<T> & ArrayFormFieldFieldValue<T, K>;

export const ArrayFormField = <FormModel, K extends keyof FormModel>(
  props: Props<FormModel, K>,
) => {
  const {
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
  } = useFormikContext<FormModel>();

  const {
    fieldOptions,
    disabled,
    title,
    location,
  } = props;

  const {
    arrayCardProps = {} as any,
    arrayCardItemProps = {} as any,
    arrayCardItemBodyProps = {} as any,
    arrayCardItemBodyTypographyEmptyProps = {} as any,
    arrayCardItemBodyElementCardProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderTypographyProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderViewProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderViewUpButtonProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderViewDownButtonProps = {} as any,
    arrayCardItemBodyElementCardItemHeaderViewRemoveButtonProps = {} as any,
    arrayCardItemBodyElementCardItemProps = {} as any,
    arrayCardItemBodyElementCardItemBodyProps = {} as any,
    arrayCardItemFooterProps = {} as any,
    arrayCardItemFooterAddButtonProps = {} as any,
    displayIndex = true,
    displayControllers = true,
  } = fieldOptions;

  const value: any[] = getIn(values, location);
  const onValueChange = onChange(handleChange, location);
  const error = getIn(errors, location);
  const isTouched = getIn(touched, location);

  useEffect(() => {
    if (isSubmitting) {
      if (!Array.isArray(error)) {
        setFieldTouched(location);
      }
    }
  }, [error, isSubmitting, location, setFieldTouched]);

  const remove = (index: number) => {
    const formValues = value;
    formValues?.splice(index, 1);
    onValueChange(formValues);
  };

  const swap = (index: number, direction: 'up' | 'down') => {
    const formValues = value;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = formValues[targetIndex];
    formValues[targetIndex] = formValues[index];
    formValues[index] = temp;
    onValueChange(formValues);
  };

  return (
    <Card
      {...arrayCardProps}
      style={{
        elevation: 0,
        borderColor: 'transparent',
      }}
    >
      <CardItem
        {...arrayCardItemProps}
        style={{
          width: '100%',
        }}
      >
        <Body
          style={{
            width: '100%',
          }}
          {...arrayCardItemBodyProps}
        >
          {
            !value.length && (
              <Typography
                {...arrayCardItemBodyTypographyEmptyProps}
              >
                No items yet. Press add to create a new item.
              </Typography>
            )
          }
          {
            !!value.length && (
              value?.map((item, index) => (
                <Card
                  style={{
                    width: '100%',
                    elevation: 0,
                    borderColor: 'transparent',
                  }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}`}
                  {...arrayCardItemBodyElementCardProps}

                >
                  {displayControllers && (
                  <CardItem
                    header
                    {...arrayCardItemBodyElementCardItemHeaderProps}
                  >
                    {displayIndex && (
                    <Typography
                      {...arrayCardItemBodyElementCardItemHeaderTypographyProps}
                    >
                      {`${title} ${index + 1}`}
                    </Typography>
                    )}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                      {...arrayCardItemBodyElementCardItemHeaderViewProps}
                    >
                      <Button
                        disabled={index === 0 || disabled}
                        onPress={() => {
                          swap(index, 'up');
                        }}
                        {...arrayCardItemBodyElementCardItemHeaderViewUpButtonProps}
                      >
                        &#8593;
                      </Button>
                      <Button
                        disabled={(index === value.length - 1) || disabled}
                        onPress={() => {
                          swap(index, 'down');
                        }}
                        {...arrayCardItemBodyElementCardItemHeaderViewDownButtonProps}
                      >
                        &#8595;
                      </Button>
                      <Button
                        variant="contained"
                        disabled={disabled}
                        onPress={() => {
                          remove(index);
                        }}
                        {...arrayCardItemBodyElementCardItemHeaderViewRemoveButtonProps}
                      >
                        Remove
                      </Button>
                    </View>
                  </CardItem>
                  )}
                  <CardItem
                    {...arrayCardItemBodyElementCardItemProps}
                  >
                    <Body
                      style={{
                        width: '100%',
                      }}
                      {...arrayCardItemBodyElementCardItemBodyProps}

                    >
                      <FormFieldCondition<FormModel[K], keyof FormModel[K]>
                        fieldData={fieldOptions.formData as any}
                        location={`${location}[${index}]`}
                      />
                    </Body>
                  </CardItem>
                </Card>
              ))
            )
          }
        </Body>
      </CardItem>
      <CardItem
        footer
        {...arrayCardItemFooterProps}
      >
        <Button
          variant="contained"
          disabled={disabled}
          size="full"
          onPress={() => {
            onValueChange([
              ...value,
              generateInitialValues(fieldOptions.formData as any),
            ]);
            if (!Array.isArray(error)) {
              setFieldTouched(location);
            }
          }}
          {...arrayCardItemFooterAddButtonProps}

        >
          Add
        </Button>
      </CardItem>
      <FieldError
        errors={error}
        touched={isTouched}
      />
    </Card>
  );
};

/* eslint-enable @typescript-eslint/no-explicit-any */
