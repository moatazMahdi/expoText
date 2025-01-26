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
import CountryPicker, {
  Country,
  Flag,
} from 'react-native-country-picker-modal';
import {
  ThemeContext,
} from '../../../theming/context';
import {
  Styles,
  styles as themedStyles,
} from './styles';
import {
  CountryPickerProps,
} from './types';

export const FormCountryPickerComponent: React.FC<
CountryPickerProps
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
  // const [currentCountryCode, setCountryCode] = useState('+20');
  const [modalVisible, setModalVisible] = useState(false);
  const focus = () => {
    setModalVisible(true);
  };

  const blur = () => {
    setModalVisible(false);
  };

  const close = () => {
    if (props.onClose) {
      props.onClose();
    } else {
      blur();
    }
  };

  const {
    onPress,
    touched,
    error,
    onChange,
    label,
    hasLabel,
    correctPickerStyle,
    incorrectPickerStyle,
    countryCode,
    withCallingCode,
    withCloseButton,
    countryCodes,
    withFlag,
    withAlphaFilter,
    handleChange,
  } = props;
  return (
    <View
      style={hasLabel ? styles.inputWithLableStyle : styles.textInputContainer}
    >
      {hasLabel && <Text style={styles.labelContainerStyle}>{label}</Text>}
      <View style={[
        styles.countryPickerContainer,
      ]}
      >
        {hasLabel && (
          <Text style={[styles.labelContainerStyle]}>{label}</Text>
        )}
        <CountryPicker
          onSelect={(countryValue) => {
            const bla = {
              target: {
                value: countryValue,
              },
            };
            handleChange(bla as any);
            if (onChange) {
              onChange(bla as any);
            }
          }}
          onClose={close}
          countryCode={countryCode}
          withCallingCode={withCallingCode}
          withCloseButton={withCloseButton}
          countryCodes={countryCodes}
          withFlag={withFlag}
          withAlphaFilter={!withAlphaFilter}
          renderFlagButton={() => (
            <TouchableOpacity
              style={
                touched && error
                  ? [
                    styles.incorrectPickerStyle,
                    incorrectPickerStyle,
                  ]
                  : [
                    styles.correctPickerStyle,
                    correctPickerStyle,
                  ]
              }
              onPress={() => {
                focus();
                onPress();
              }}
            >
              <View style={styles.countryPickerContainer}>
                {withCallingCode && (
                  <Text
                    style={[
                      styles.callingCode,
                    ]}
                  >
                    {(props.value as Country).callingCode}
                  </Text>
                )}
              </View>
              <Flag
                countryCode={(props.value as Country).cca2}
                flagSize={24}
              />
            </TouchableOpacity>
          )}
          modalProps={{
            visible: modalVisible,
          }}
        />
      </View>
      {touched && error && (
        <Text style={styles.inputError}>{error}</Text>
      )}
    </View>
  );
};
