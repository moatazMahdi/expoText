import {
  FormikErrors,
  FormikTouched,
} from 'formik';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  FieldTypes,
} from '../types';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  TextInputWithErrorsProps,
} from './types';

export const TextInputWithErrors: React.FC<
TextInputWithErrorsProps
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
  let inputRef: TextInput | null;

  const focus = () => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  const blur = () => {
    if (inputRef) {
      inputRef.blur();
    }
  };

  const {
    index,
    focusedIndex,
  } = props;
  useEffect(() => {
    if (index === focusedIndex) {
      focus();
    } else {
      blur();
    }
  }, [
    index,
    focusedIndex,
  ]);

  const selectInputStyle = (
    error: string | string[] | undefined | FormikErrors<any> | FormikErrors<any>[],
    touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined,
  ): TextStyle | TextStyle[] => {
    const {
      incorrectFieldStyle,
      correctFieldStyle,
    } = props;
    if (error && touched) {
      if (incorrectFieldStyle) {
        return incorrectFieldStyle;
      }
      return [
        styles.inputFieldStyleIncorrect,
      ];
    }
    if (correctFieldStyle) {
      return correctFieldStyle;
    }
    return [
      styles.inputFieldStyleCorrect,
    ];
  };

  const fixProps = (): TextInputWithErrorsProps => {
    const {
      value,
      onChange: onChangeText,
      onBlur,
      placeholder,
      touched,
      error,
      errorsStyle,
      secureTextEntry,
      hasLabel,
      label,
      inputWithLableStyle,
      keyboardType,
      handleChange,
    } = props;
    let {
      onSubmitEditing,
      returnKeyType,
      selectTextOnFocus,
      clearTextOnFocus,
      onFocus,
    } = props;
    onSubmitEditing = onSubmitEditing || (() => null);
    returnKeyType = returnKeyType || 'next';
    selectTextOnFocus = selectTextOnFocus || false;
    clearTextOnFocus = clearTextOnFocus || false;
    onFocus = onFocus || (() => null);
    return {
      value,
      onChange: onChangeText,
      onBlur,
      placeholder,
      touched,
      error,
      errorsStyle,
      secureTextEntry,
      onSubmitEditing,
      returnKeyType,
      selectTextOnFocus,
      clearTextOnFocus,
      onFocus,
      hasLabel,
      label,
      inputWithLableStyle,
      keyboardType,
      handleChange,
      type: FieldTypes.TEXT_FIELD,
    };
  };

  const {
    value,
    onChange: onChangeText,
    onBlur,
    placeholder,
    touched,
    error,
    errorsStyle,
    secureTextEntry,
    // onSubmitEditing,
    returnKeyType,
    selectTextOnFocus,
    clearTextOnFocus,
    onFocus,
    hasLabel,
    label,
    keyboardType,
    handleChange,
  } = fixProps();
  return (
    <View
      style={[
        hasLabel
          ? styles.inputWithLableStyle
          : styles.textInputContainer,
      ]}
    >
      {hasLabel
        && (
        <Text
          style={[
            styles.labelContainerStyle,
          ]}
        >
          {label}
        </Text>
        )}
      <View
        style={{
          width: '100%',
        }}
      >
        <TextInput
          ref={(ref) => (inputRef = ref)}
          style={
            hasLabel
              ? [
                styles.inputWithLableStyle,
                {
                  width: '70%',
                },
                selectInputStyle(error, touched),
              ]
              : [
                selectInputStyle(error, touched),
              ]
          }
          value={value}
          onChangeText={(e) => {
            handleChange(e);
            if (onChangeText) {
              onChangeText(e);
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.palette.primary.contrast}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={() => {
            if (props.focusOnNext) {
              props.focusOnNext();
            }
          }}
          returnKeyType={returnKeyType}
          selectTextOnFocus={selectTextOnFocus}
          clearTextOnFocus={clearTextOnFocus}
          onFocus={onFocus}
          keyboardType={keyboardType}
        />

        <View style={styles.errorContainer}>
          {touched && error && (
            <Text
              style={
                [
                  errorsStyle || styles.inputError,
                ]
              }
            >
              {error}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
