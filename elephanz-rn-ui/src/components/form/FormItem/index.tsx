import React, {
  useEffect,
} from 'react';
import {
  BottomScreenButton,
} from '../BottomScreenButton';
import {
  FormCountryPicker,
} from '../../inputs/FormCountryPicker';
import {
  FormDatePickerComponent,
} from '../FormDatePickerComponent';
import {
  PickerComponent,
} from '../PickerComponent';
import {
  TextAreaComponent,
} from '../TextAreaComponent';
import {
  TextInputWithErrors,
} from '../TextInputWithErrors';
import {
  FormItemProps,
  isBottomScreenButton,
  isCountryPicker,
  isDatePicker,
  isPicker,
  isTextArea,
  isTextInput,
} from './types';

export const FormItem: React.FC<FormItemProps> = (props) => {
  const focusNext = () => {
  };
  const {
    index,
    focusedIndex,
  } = props;
  useEffect(() => {
    // if (onFocus && index === focusedIndex) {
    // }
  }, [
    index,
    focusedIndex,
  ]);
  const formItemProps = props;
  if (isTextInput(formItemProps)) {
    return (
      <TextInputWithErrors
        {...formItemProps}
        // ref={ref => (formItemRef = ref)}
        onSubmitEditing={() => {
          focusNext();
          if (formItemProps.onSubmitEditing) {
            formItemProps.onSubmitEditing();
          }
        }}
      />
    );
  }
  if (isPicker(formItemProps)) {
    return (
      <PickerComponent
        {...formItemProps}
        // ref={ref => (formItemRef = ref)}
        onSubmitEditing={() => {
          // this.focusNext();
          if (formItemProps.onSubmitEditing) {
            formItemProps.onSubmitEditing();
          }
        }}
      />
    );
  }
  if (isDatePicker(formItemProps)) {
    return (
      <FormDatePickerComponent
        {...formItemProps}
        // ref={ref => (formItemRef = ref)}
        onSubmitEditing={() => {
          focusNext();
          if (formItemProps.onSubmitEditing) {
            formItemProps.onSubmitEditing();
          }
        }}
      />
    );
  }
  if (isBottomScreenButton(formItemProps)) {
    return <BottomScreenButton {...formItemProps} />;
  }
  if (isTextArea(formItemProps)) {
    return (
      <TextAreaComponent
        {...formItemProps}
        // ref={ref => (formItemRef = ref)}
        onSubmitEditing={() => {
          focusNext();
          if (formItemProps.onSubmitEditing) {
            formItemProps.onSubmitEditing();
          }
        }}
      />
    );
  }
  if (isCountryPicker(formItemProps)) {
    return (
      <FormCountryPicker
        {...formItemProps}
        // ref={ref => (formItemRef = ref)}
        onSubmitEditing={() => {
          focusNext();
          if (formItemProps.onSubmitEditing) {
            formItemProps.onSubmitEditing();
          }
        }}
      />
    );
  }
  return null;
};
