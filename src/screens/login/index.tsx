import React, {useEffect, useState} from 'react';
import {View, Pressable, Alert, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useRoute} from '@react-navigation/native';
import ReactMoE from 'react-native-moengage';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {phoneNumberValidation, validate} from 'src/utils/Validation';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import NavigationHeader from 'src/components/NavigationHeader';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {ContinueButton} from 'components';
import {
  acceptAppTrackPermissions,
  createBiometricKey,
} from 'src/utils/HelpersFunctions';
import {Assets} from 'assets';
import styles from './styles';

export const NewLoginScreen: React.FC = () => {
  const canCreateBioMetric = useRoute().params?.canCreateBioMetric as any;

  const [phoneHasPassword, setPhoneHasPassword] = useState<boolean>(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = React.useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const savedPhoneNumber = stores.backend?.auth?.getSavedPhone()?.substring(2);
  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    savedPhoneNumber ?? '',
  );

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      acceptAppTrackPermissions();
    }
  }, []);

  const onNavigateLoginSignup = async (phoneNumber?: number) => {
    ApplicationAnalytics({eventKey: 'user_go_signUp', type: 'CTA'}, stores);
    phoneNumber
      ? navigation.navigate('signUp', {phone: phoneNumber})
      : navigation.navigate('signUp');
  };

  const onNavigateVerifyNumber = async () => {
    ApplicationAnalytics(
      {
        eventKey: 'forget_password',
        type: 'CTA',
      },
      stores,
    );

    if (isLoading) return;
    setIsLoading(true);
    const verifyPhoneCodeRes = await stores.backend.auth.verifyPhoneNumber(
      phoneNumber,
      'login',
      'login'
    );
    navigation.navigate('verification', {
      phoneNumber,
      fromScreen: 'login',
      changePassword: true,
      otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
    });
    setIsLoading(false);
  };

  const onActivateBiometric = async () => {
    if (phoneNumber) {
      createBiometricKey(
        translate,
        'user_login',
        `+2${phoneNumber}`,
        stores,
        setIsLoading,
        navigation,
      );
    }
  };

  const onLogin = async () => {
    setIsLoading(true);
    try {
      const userCredentials = await stores.backend.auth.loginWithPhoneAndCode(
        phoneNumber,
        password,
      );
      if (userCredentials && userCredentials.isSuccessful) {
        // Navigate to Home Page if Existing user
        stores.backend.users.setRole('USER');
        await stores.backend.auth.setHideContinueAsGuest(true);
        stores.backend.users.setRegistered(true);
        try {
          await stores.backend.users.getUserById(userCredentials.userId);
          const user = stores.backend.users?.userData;
          ReactMoE.setUserUniqueID(`${user?.id}`);
          if (stores.backend.users.userData?.phone !== savedPhoneNumber) {
            await stores.backend.auth.setSavedPhone(
              stores.backend.users.userData?.phone,
            );
          }
          if (canCreateBioMetric) {
            onActivateBiometric();
          } else navigation.resetTo({name: 'home'});
        } catch (error) {
          setIsLoading(false);
          stores.backend.auth.setAccessToken('');
          Alert.alert('', translate('ERROR'), [
            {text: translate('GENERIC_CONFIRM')},
          ]);
        }
      } else {
        throw Error('Code Verification failed');
      }
    } catch (error: any) {
      ApplicationAnalytics(
        {
          eventKey: 'user_login',
          type: 'STATUS',
          parameters: {statusName: 'Failed_Login'},
        },
        stores,
      );
      Alert.alert(
        translate('LOGIN_CODE_ERROR_TITLE'),
        error.response.data.message,
      );
    }
    setIsLoading(false);
  };

  const checkPhoneHasPassword = async () => {
    setIsLoading(true);
    try {
      const data = await stores.backend.auth.CheckPhoneHasPassword(phoneNumber);
      if (data.hasPassword) {
        ApplicationAnalytics(
          {eventKey: 'user_login_hasPass', type: 'CTA'},
          stores,
        );
        setPhoneHasPassword(true);
      } else if (
        data?.error === 'User not found' ||
        data?.error === 'المستخدم غير موجود'
      ) {
        setPhoneHasPassword(false);

        ApplicationAnalytics(
          {eventKey: 'user_should_register', type: 'CTA'},
          stores,
        );
        onNavigateLoginSignup(phoneNumber);
      } else if (
        data?.statusCode !== 502 &&
        data?.statusCode !== 403 &&
        data?.statusCode !== 429 &&
        data?.statusCode !== 400
      ) {
        setPhoneHasPassword(false);
        // Should Navigate to OTP Verification
        ApplicationAnalytics(
          {eventKey: 'user_login_hasNoPass', type: 'CTA'},
          stores,
        );
        const verifyPhoneCodeRes = await stores.backend.auth.verifyPhoneNumber(
          phoneNumber,
          'login',
          'login'
        );
        navigation.navigate('verification', {
          phoneNumber,
          fromScreen: 'login',
          otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
          canCreateBioMetricFromLogin: canCreateBioMetric,
        });
      }
    } catch (error) {
      setPhoneHasPassword(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate for login button
  const checkValidation = () => {
    return isValidPhoneNumber && phoneNumber != '';
  };

  const onNextPressed = () => {
    // if phone number is valid and phone has password and password is not empty
    // active login
    const phoneValid = checkValidation();
    if (phoneValid && phoneHasPassword && password.length >= 8) {
      onLogin();
    } else if (phoneValid && phoneHasPassword && password.length < 8) {
      Alert.alert('', translate('PASSWORD_MUST_BE_AT_LEAST_8_CHARS'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    } else if (phoneValid && !phoneHasPassword) {
      checkPhoneHasPassword();
    }
  };

  const handleOnKeyboardContinue = () => {
    checkValidation() && onNextPressed();
  };

  const showPhoneFieldIcon = () => {
    return creditech.checkedBox;
  };

  const handlePhoneNumberChange = value => {
    setPhoneNumber(value);
    setIsValidPhoneNumber(validate(value, phoneNumberValidation));
  };

  const renderPhoneField = () => (
    <View>
      <DropShadowWrapper style={[selectStyle('phoneFieldContainer')]}>
        <DefaultTextInput
          placeholder={translate('PHONE_NUMBER_PLACE_HOLDER')}
          placeholderTextColor={common.creamyWhite}
          value={phoneNumber}
          onchangeText={handlePhoneNumberChange}
          keyboardType="number-pad"
          viewStyle={selectStyle('phoneInputView')}
          inputContainer={selectStyle('inputContainer')}
          textInputStyle={selectStyle('textInputStyle')}
          returnKeyType={'done'}
          onSubmitEditing={handleOnKeyboardContinue}
          startIcon={creditech.phoneFiledIcon}
          icon={phoneHasPassword && showPhoneFieldIcon()}
          iconStyle={{marginEnd: wp(2)}}
          iconWidth={35}
          svgProps={{fill: common.lightGreen}}
          maxLength={11}
        />
      </DropShadowWrapper>

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

  const renderPasswordField = () => (
    <DropShadowWrapper
      style={[selectStyle('phoneFieldContainer'), {marginTop: hp(26)}]}>
      <DefaultTextInput
        placeholder={translate('PASSWORD')}
        placeholderTextColor={common.creamyWhite}
        value={password}
        onchangeText={setPassword}
        viewStyle={selectStyle('phoneInputView')}
        inputContainer={selectStyle('inputContainer')}
        textInputStyle={selectStyle('textInputStyle')}
        secureTextEntry={!showPass}
        textContentType={'password'}
        autoFocus={true}
        returnKeyType={'done'}
        onSubmitEditing={handleOnKeyboardContinue}
        startIcon={creditech.passwordFieldIcon}
        icon={showPass ? creditech.Eye : creditech.EyeClosed}
        iconStyle={{marginEnd: wp(2)}}
        iconWidth={35}
        onPress={() => setShowPass(!showPass)}
      />
    </DropShadowWrapper>
  );

  const renderSignUpText = () => (
    <Pressable
      onPress={() => onNavigateLoginSignup()}
      style={selectStyle('signUpTextContainer')}>
      <Typography
        customStyles={() => ({
          text: selectStyle('haveAccountText'),
        })}>
        {translate('DONT_HAVE_AN_ACCOUNT')}
      </Typography>

      <Typography
        customStyles={() => ({
          text: selectStyle('signUpText'),
        })}>
        {translate('SING_UP_NOW')}
      </Typography>
    </Pressable>
  );

  const renderForgetPasswordText = () => (
    <Pressable
      style={selectStyle('forgotPassTextContainer')}
      onPress={onNavigateVerifyNumber}>
      <Typography
        customStyles={() => ({
          text: selectStyle('forgotPassText'),
        })}>
        {translate('FORGOT_PASSWORD')}
      </Typography>
    </Pressable>
  );

  const showPasswordFieled = () => {
    if (phoneHasPassword && checkValidation()) {
      return renderPasswordField();
    } else if (phoneHasPassword) {
      setPhoneHasPassword(false);
      setPassword('');
      return null;
    } else return null;
  };

  return (
    <View style={selectStyle('mainContainer')}>
      <NavigationHeader
        shapeVariant="yellow"
        title={translate('LOGIN/SIGNUP')}
      />
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}>
          {`${
            phoneHasPassword
              ? translate('NOW_PASSWORD')
              : translate('ENTER_PHONE_NUMBER')
          }`}
        </Typography>

        {renderPhoneField()}

        {showPasswordFieled()}

        {phoneHasPassword && renderForgetPasswordText()}

        {renderSignUpText()}

        <ContinueButton
          onContinuePressed={onNextPressed}
          completeForm={
            phoneNumber != '' && validate(phoneNumber, phoneNumberValidation)
          }
          loading={isLoading}
        />
      </KeyboardAwareScrollView>

      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};
