import React from 'react';
import {
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {
  styles,
} from './styles';
import {
  Props,
} from './types';

export const DatePickerComponent: React.FC<
Props
> = (props) => {
  const defaultDate = new Date();

  // let datePickerRef: DatePicker;
  const {
    mode,
    placeholder,
    format,
    minDate,
    maxDate,
    confirmBtnText,
    cancelBtnText,
    onDateChange,
  } = props;
  return (
    <View style={styles.mainContainer}>
      <DatePicker
        // ref={(ref: DatePicker) => (datePickerRef = ref)}
        style={styles.container}
        date={defaultDate}
        mode={mode}
        placeholder={placeholder}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        confirmBtnText={confirmBtnText}
        cancelBtnText={cancelBtnText}
        onDateChange={(dateStr, date) => onDateChange(date)}
      />
    </View>
  );
};
