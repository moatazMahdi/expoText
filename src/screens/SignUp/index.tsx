import React, {FC, useEffect, useRef} from 'react';
import {View, TextInput, Alert, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute} from '@react-navigation/native';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {ContinueButton} from 'components';
import {
  fullNameValidation,
  phoneNumberValidation,
  validate,
} from 'src/utils/Validation';
import styles from './styles';

export const NewSignUp: FC = () => {
  const routeParams = useRoute()?.params as {phone: string; code: string};

  const [isValidPhoneNumber, setIsValidPhoneNumber] = React.useState(true);
  const [isValidFullName, setIsValidFullName] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>('');

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();
  const phoneFieldRef = useRef();

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    if (routeParams?.phone) {
      setPhoneNumber(routeParams?.phone);
    }
    return () => {
      setPhoneNumber('');
    };
  }, [routeParams]);

  const showErrorAlert = errorMessage => {
    Alert.alert('', errorMessage);
    setIsLoading(false);
  };

  const onContinuePressed = async () => {
    setIsLoading(true);
    if (!isCompleteForm) {
      if (!firstName?.trim()) {
        showErrorAlert(translate('FULL_NAME_REQUIRED'));
      } else if (!isValidFullName) {
        showErrorAlert(translate('PLEASE_ENTER_NAME_AS_IN_NID'));
      } else if (!phoneNumber) {
        showErrorAlert(translate('LOGIN_ENTER'));
      } else if (!isValidPhoneNumber) {
        showErrorAlert(translate('PHONE_NUMBER_NOT_CORRECT'));
      }
    } else {
      try {
        const userExists = await checkUserExists();

        if (userExists) {
          Alert.alert('', translate('USER_ALREADY_REGISTERED'), [
            {text: translate('GENERIC_CONFIRM')},
          ]);
          setIsLoading(false);
          return;
        }

        ApplicationAnalytics(
          {
            eventKey: 'enter_signup_data',
            type: 'CTA',
          },
          stores,
        );

        const verifyPhoneCodeRes = await stores.backend.auth.verifyPhoneNumber(
          phoneNumber,
          "register",
          "register"
        );

        navigation.navigate('verification', {
          phoneNumber,
          fromScreen: 'signUp',
          otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
          name: firstName?.trim() + ' ',
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  const renderPhoneField = (
    setInputChange,
    placeHolder: string,
    value: string,
    _keyboardType,
  ) => (
    <View>
      <View style={selectStyle('inputFieldContainer')}>
        <TextInput
          placeholder={placeHolder}
          value={value}
          keyboardType={_keyboardType ? _keyboardType : 'default'}
          onChangeText={value => {
            setInputChange(value);
            setIsValidPhoneNumber(validate(value, phoneNumberValidation));
          }}
          placeholderTextColor={common.creamyWhite}
          style={selectStyle('inputField')}
          returnKeyType="done"
          onSubmitEditing={() => onContinuePressed()}
          ref={phoneFieldRef}
          maxLength={11}
        />
      </View>

      {!isValidPhoneNumber && (
        <Typography
          customStyles={() => ({
            text: selectStyle('errorMessage'),
          })}>
          {translate('PHONE_FIELD_ERROR')}
        </Typography>
      )}
    </View>
  );

  const renderNameField = (
    setInputChange,
    placeHolder: string,
    value: string,
    _keyboardType,
  ) => {
    const handleTextChange = text => {
      // Remove any numeric characters from the input
      const textWithoutNumbers = text.replace(/[0-9٠١٢٣٤٥٦٧٨٩]/g, '');
      setInputChange(textWithoutNumbers);
      setIsValidFullName(validate(textWithoutNumbers, fullNameValidation));
    };

    return (
      <View>
        <View style={selectStyle('fullnameInputFieldContainer')}>
          <TextInput
            placeholder={placeHolder}
            value={value}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            onChangeText={value => {
              handleTextChange(value);
            }}
            placeholderTextColor={common.creamyWhite}
            style={selectStyle('inputField')}
            returnKeyType="next"
            onSubmitEditing={() => {
              phoneFieldRef?.current?.focus();
            }}
          />
        </View>

        {!isValidFullName && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}>
            {translate('PLEASE_ENTER_NAME_AS_IN_NID')}
          </Typography>
        )}
      </View>
    );
  };

  const checkUserExists = async () => {
    try {
      const data = await stores.backend.auth.CheckPhoneHasPassword(phoneNumber);
      if (data.hasPassword) {
        return true;
      } else if (
        data?.error === 'User not found' ||
        data?.error === 'المستخدم غير موجود'
      ) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const isCompleteForm = () => {
    if (phoneNumber === '' || firstName === '') {
      return false;
    }

    if (!isValidFullName || !isValidPhoneNumber) {
      return false;
    }

    return true;
  };

  return (
    <View style={selectStyle('mainContainer')}>
      <NavigationHeader shapeVariant="tangelo" title={translate('SIGNUP')} />

      <View style={selectStyle('titleContainer')}>
        <Typography customStyles={() => ({text: selectStyle('titleText')})}>
          {translate('TELL_US_ABOUT_YOUR_SELF')}
        </Typography>
      </View>

      <KeyboardAwareScrollView
        scrollEnabled
        contentContainerStyle={selectStyle('mainContainer')}>
        {renderNameField(
          setFirstName,
          translate('TELL_US_FULL_NAME'),
          firstName,
          'default',
        )}

        {!routeParams?.phone &&
          renderPhoneField(
            setPhoneNumber,
            translate('AND_PHONE_NUMBER'),
            phoneNumber,
            'number-pad',
          )}

        <ContinueButton
          onContinuePressed={onContinuePressed}
          completeForm={isCompleteForm()}
        />
      </KeyboardAwareScrollView>

      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};
