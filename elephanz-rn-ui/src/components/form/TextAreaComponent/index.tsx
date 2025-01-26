import {
  FormikErrors,
  FormikTouched,
} from 'formik';
import {
  Textarea,
} from 'native-base';
import React, {
  createRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Text,
  TextStyle,
  View,
} from 'react-native';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  TextAreaComponentProps,
} from './types';

export const TextAreaComponent: React.FC<
TextAreaComponentProps
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

  const inputRef = createRef<Textarea>();
  // const focus = () => {
  //   if (inputRef) {
  //     (inputRef.current as any)._root.focus();
  //   }
  // };

  // const blur = () => {
  //   if (inputRef) {
  //     (inputRef.current as any)._root.blur();
  //   }
  // };

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
    return styles.inputFieldStyleCorrect;
  };

  const {
    value,
    onChange,
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
    rowSpan,
    handleChange,
    bordered,
    underline,
  } = props;
  return (
    <View
      style={[
        hasLabel
          ? styles.inputWithLableStyle
          : styles.textInputContainer,
      ]}
    >
      {
        hasLabel
        && (
        <Text
          style={
            [
              styles.labelContainerStyle,
            ]
          }
        >
          {label}
        </Text>
        )
      }
      <Textarea
        rowSpan={rowSpan}
        bordered={bordered}
        underline={underline}
        ref={inputRef}
        style={
          hasLabel
            ? [
              styles.inputWithLableStyle,
              selectInputStyle(error, touched),
            ]
            : [
              selectInputStyle(error, touched),
            ]
        }
        value={value}
        onChangeText={(e) => {
          handleChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.palette.secondary.contrast}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        selectTextOnFocus={selectTextOnFocus}
        clearTextOnFocus={clearTextOnFocus}
        onFocus={onFocus}
      />
      <View style={styles.errorContainer}>
        {touched && error && (
          <Text
            style={[errorsStyle || styles.inputError]}
          >
            {error}
          </Text>
        )}
      </View>
    </View>
  );
};
