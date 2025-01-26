import {
  useStyles,
} from 'elephanz-rn-ui/src/theming';
import React, {
  useState,
} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {
  Country,
} from 'react-native-country-picker-modal';
import {
  ExtendedSVG,
} from '../../dataDisplay';
import {
  defaultStyles,
} from './styles';
import {
  CountryPickerProps,
} from './types';
import chevronDown from '../../../assets/images/chevronDown.svg';

export const FormCountryPicker: React.FC<
CountryPickerProps
> = (props) => {
  const {
    selectStyle,
  } = useStyles(defaultStyles);
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
      style={hasLabel ? selectStyle('inputWithLableStyle') : selectStyle('textInputContainer')}
    >
      <Text style={selectStyle('labelContainerStyle')}>{label}</Text>
      <View style={[
        selectStyle('countryPickerContainer'),
      ]}
      >
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
                    selectStyle('incorrectPickerStyle'),
                    incorrectPickerStyle,
                    selectStyle('container'),
                  ]
                  : [
                    selectStyle('correctPickerStyle'),
                    correctPickerStyle,
                    selectStyle('container'),
                  ]
              }
              onPress={() => {
                focus();
                onPress();
              }}
            >
              <View style={selectStyle('countryPickerContainer')}>
                <Text
                  style={[
                    selectStyle('callingCode'),
                  ]}
                >
                  {(props.value as Country).callingCode}
                </Text>
                <ExtendedSVG
                  svgFile={chevronDown}
                  style={[
                    selectStyle('chevron'),
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
          modalProps={{
            visible: modalVisible,
          }}
        />
      </View>
      {touched && error && (
        <Text style={selectStyle('inputError')}>{error}</Text>
      )}
    </View>
  );
};
