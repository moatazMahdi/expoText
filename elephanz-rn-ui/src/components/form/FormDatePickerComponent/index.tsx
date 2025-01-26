import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  FakeEvent,
} from '../types';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  DatePickerProps,
} from './types';

export const FormDatePickerComponent: React.FC<
DatePickerProps
> = (props) => {
  const {
    theme,
  } = useContext(ThemeContext);
  const [styles, setStyles] = useState<Styles>(themedStyles(theme));
  useEffect(() => {
    setStyles(themedStyles(theme));
  }, [
    theme,
  ]);
  let datePickerRef: DatePicker | null;
  const focus = () => {
    if (datePickerRef) {
      datePickerRef.onPressDate();
    }
  };

  // const blur = () => {
  //   if (datePickerRef) {
  //     datePickerRef.onPressCancel();
  //   }
  // };

  const selectContainerStyle = () => {
    const {
      hasLabel,
      inputWithLableStyle,
      error,
      touched,
      style,
    } = props;
    if (hasLabel) {
      if (inputWithLableStyle) {
        return inputWithLableStyle;
      }
      return styles.inputWithLableStyle;
    }
    if (error && touched) {
      if (style) {
        return (
          [
            style,
          ]
        );
      }
      return (
        [
          styles.incorrectPickerStyle,
        ]
      );
    }
    if (style) {
      return (
        [
          style,
        ]
      );
    }
    return (
      [
        styles.correctPickerStyle,
      ]
    );
  };

  const {
    onPress,
    placeholder,
    touched,
    error,
    value,
    onChange: onDateChange,
    format,
    minDate,
    maxDate,
    confirmBtnText,
    cancelBtnText,
    mode,
    onSubmitEditing,
    hasLabel,
    label,
    handleChange,
    activeTextStyle,
  } = props;
  return (
    <View>
      {hasLabel && <Text style={styles.labelContainerStyle}>{label}</Text>}
      <View
        style={[
          styles.pickerContainerStyle,
        ]}
      >
        <TouchableOpacity
          style={selectContainerStyle()}
          onPress={() => {
            focus();
            onPress();
          }}
        >
          <Text style={activeTextStyle || styles.textActiveStyle}>
            {typeof value === 'string' ? value : value.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {touched && error && value === 'Birth Date' && (
          <Text
            style={[
              styles.inputError,
            ]}
          >
            {error}
          </Text>
        )}
      </View>
      <View
        style={styles.dateContainer}
      >
        <DatePicker
          ref={(ref) => datePickerRef = ref}
          date={typeof value === 'string' ? new Date() : value}
          mode={mode}
          placeholder={placeholder}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          confirmBtnText={confirmBtnText}
          cancelBtnText={cancelBtnText}
          onDateChange={(dateStr, date) => {
            const d: FakeEvent = {
              target: {
                value: date,
              },
            };
            handleChange(d as any);
            if (onDateChange) {
              onDateChange(date);
            }

            if (onSubmitEditing && date) {
              onSubmitEditing();
            }
          }}
        />
      </View>

    </View>
  );
};
