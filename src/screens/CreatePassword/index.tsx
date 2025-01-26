import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactMoE from 'react-native-moengage';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {BottomContainer} from 'src/components/BottomContainer';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import NavigationHeader from 'src/components/NavigationHeader';
import DefaultButton from 'src/components/DefaultButton';
import {useRoute} from '@react-navigation/native';
import Biometric from 'src/components/Biometric';
import {wp} from 'src/utils/Dimensions/dimen';
import {passwordRules} from './passwordRules';
import SvgView from 'src/components/SvgView';
import {
  checkBiometric,
  createBiometricKey,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {Assets} from 'assets';
import styles from './styles';

export const CreatePassword: React.FC = () => {
  const {
    phoneNumber,
    name,
    fromScreen,
    canCreateBioMetricFromLogin,
    otpToken,
    changePassword,
  } = (useRoute().params as any) || {};

  const [passwordConstraints, setPasswordConstraints] = useState<any>({
    length: false,
    upperCase: false,
    lowerCase: false,
    oneNumber: false,
    oneSpecialChar: false,
    noSpaces: false,
    isMatch: false,
  });
  const [canCreateBioMetric, setCanCreateBioMetric] = useState<boolean>(false);
  const [biometricOnDevice, setBiometricOnDevice] = useState<boolean>(false);
  const [showConfirmedPass, setShowConfirmedPass] = useState<boolean>(false);
  const [userStoredPhone, setUserStoredPhone] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();
  const stores = useStores();

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
    const getBiometricUser = async () => {
      const userPhone = await AsyncStorage.getItem('hasBiometric');
      setUserStoredPhone(userPhone);
    };

    checkBiometric().then(res => {
      setBiometricOnDevice(res.available);
    });

    getBiometricUser();
  }, []);

  const registerBiometric = async () => {
    if (phoneNumber) {
      createBiometricKey(
        translate,
        'signUp',
        phoneNumber,
        stores,
        setIsLoading,
        navigation,
        setUserStoredPhone,
      );
    }
  };

  const validatePassword = () => {
    const passwordRules = {
      length: false,
      upperCase: false,
      lowerCase: false,
      oneNumber: false,
      oneSpecialChar: false,
      noSpaces: false,
      isMatch: false,
    };
    if (password.length >= 8) {
      passwordRules.length = true;
    }
    if (/[A-Z]/.test(password)) {
      passwordRules.upperCase = true;
    }
    if (/[a-z]/.test(password)) {
      passwordRules.lowerCase = true;
    }
    if (/[0-9]/.test(password)) {
      passwordRules.oneNumber = true;
    }
    if (/[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(password)) {
      passwordRules.oneSpecialChar = true;
    }
    if (!/\s/.test(password)) {
      passwordRules.noSpaces = true;
    }
    if (
      confirmPassword === password &&
      (password !== '' || confirmPassword !== '')
    ) {
      passwordRules.isMatch = true;
    }

    setPasswordConstraints(passwordRules);
    const {
      length,
      upperCase,
      lowerCase,
      oneNumber,
      oneSpecialChar,
      noSpaces,
      isMatch,
    } = passwordRules;
    if (
      length &&
      upperCase &&
      lowerCase &&
      oneNumber &&
      oneSpecialChar &&
      noSpaces &&
      isMatch
    ) {
      if (password === confirmPassword) {
        setFormValid(true);
        return;
      }
    }
    setFormValid(false);
  };

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword]);

  const onLogin = async () => {
    setIsLoading(true);

    try {
      await stores.backend.auth.UpdatePassword(phoneNumber, password, otpToken);
      //changePassword is a param passed when the user clicked forgetPassword from login screen
      if (changePassword) {
        ApplicationAnalytics(
          {
            eventKey: 'forgetPass',
            type: 'STATUS',
            parameters: {name: 'Successful_PW_reset'},
          },
          stores,
        );
      } else {
        ApplicationAnalytics(
          {
            eventKey: 'create_pass',
            type: 'STATUS',
            parameters: {name: 'Successful_Login'},
          },
          stores,
        );
      }
      const userCredentials = await stores.backend.auth.loginWithPhoneAndCode(
        phoneNumber,
        password,
      );
      if (userCredentials && userCredentials.isSuccessful) {
        // Navigate to Home Page if Existing user
        stores.backend.users.setRegistered(true);
        try {
          await stores.backend.users.getUserById(userCredentials.userId);
          const user = stores.backend.users?.userData;
          ReactMoE.setUserUniqueID(`${user?.id}`);
          if (canCreateBioMetricFromLogin) {
            registerBiometric();
          } else navigation.resetTo({name: 'home'});
        } catch (error) {
          stores.backend.auth.setAccessToken('');
          setIsLoading(false);
          Alert.alert('', translate('ERROR'), [
            {text: translate('GENERIC_CONFIRM')},
          ]);
        }
      } else {
        throw Error('Code Verification failed');
      }
    } catch (error: any) {
      if (changePassword) {
        ApplicationAnalytics(
          {
            eventKey: 'forgetPass',
            type: 'STATUS',
            parameters: {name: 'Failure_PW_Reset'},
          },
          stores,
        );
      }
      if (
        fromScreen === 'login' &&
        error.response.data.message === 'verification token expired'
      ) {
        Alert.alert('', translate('TRY_AGAIN_LATER'), [
          {onPress: () => navigation.resetTo({name: 'login'})},
        ]);
      } else {
        ApplicationAnalytics(
          {
            eventKey: 'create_pass',
            type: 'STATUS',
            parameters: {name: 'Failed_Login'},
          },
          stores,
        );
        Alert.alert(
          translate('LOGIN_CODE_ERROR_TITLE'),
          error.response.data.message,
        );
      }
    }
    setIsLoading(false);
  };

  const getLink = async () => {
    try {
      const link = await AsyncStorage.getItem('dynamicLink');
      if (link !== null) {
        return link;
      }
      return '';
    } catch (error) {
      return '';
    }
  };

  const onRegister = async () => {
    setIsLoading(true);
    try {
      const result = await stores.backend.auth.registerWithPhoneAndPassword(
        phoneNumber,
        name,
        password,
        otpToken,
      );
      const link = await getLink();

      if (result && result.isSuccessful) {
        ApplicationAnalytics(
          {eventKey: 'Signup_Registration', type: 'STATUS'},
          stores,
        );
        // Set User Role
        stores.backend.users.setRole('USER');
        await stores.backend.auth.setHideContinueAsGuest(true);
        if (link) {
          try {
            AsyncStorage.removeItem('dynamicLink');
          } catch (e) {}
        }
        // Navigate to Home Page if Existing user
        try {
          await stores.backend.users.getUserById(result.userId);
          const user = stores.backend.users?.userData;
          ReactMoE.setUserUniqueID(`${user?.id}`);
          navigation.resetTo({name: 'home'});
        } catch (error) {
          stores.backend.auth.setAccessToken('');
          setIsLoading(false);
          Alert.alert('', translate('ERROR'), [
            {text: translate('GENERIC_CONFIRM')},
          ]);
        }

        if (canCreateBioMetric) {
          registerBiometric();
          ApplicationAnalytics(
            {
              eventKey: 'ok_user_registered_biometric',
              type: 'STATUS',
              parameters: link
                ? {
                    link: link,
                  }
                : null,
            },
            stores,
          );
        } else {
          if (link) {
            ApplicationAnalytics(
              {
                eventKey: 'ok_user_registered',
                type: 'STATUS',
                parameters: {link},
              },
              stores,
            );
          } else {
            ApplicationAnalytics(
              {eventKey: 'ok_user_registered', type: 'STATUS'},
              stores,
            );
          }
        }
        ApplicationAnalytics(
          {
            eventKey: 'fb_mobile_complete_registration',
            fbStandard: true,
            type: 'STATUS',
          },
          stores,
        );
      } else {
        setIsLoading(false);
        throw Error('Code Verification failed');
      }
    } catch (error) {
      if (
        fromScreen === 'signUp' &&
        error.response.data.message === 'verification token expired'
      ) {
        Alert.alert('', translate('TRY_AGAIN_LATER'), [
          {onPress: () => navigation.resetTo({name: 'login'})},
        ]);
      } else
        Alert.alert(
          translate('LOGIN_CODE_ERROR_TITLE'),
          error.response.data.message,
        );
    }
    setIsLoading(false);
  };

  const renderPasswordField = (
    value: string,
    onChange: (text: string) => void,
    placeHolder: string,
    icon: any,
    onPress: any,
    isSecureTextEntry: boolean,
  ) => (
    <View
      removeClippedSubviews={true}
      style={selectStyle('phoneFieldContainer')}>
      <DefaultTextInput
        value={value}
        onchangeText={onChange}
        placeholder={placeHolder}
        placeholderTextColor={common.creamyWhite}
        inputContainer={selectStyle('phoneFieldInput')}
        secureTextEntry={isSecureTextEntry}
        icon={icon}
        textContentType={'password'}
        onPress={onPress}
        iconWidth={35}
        textInputStyle={selectStyle('textInputStyle')}
        viewStyle={{marginTop: 0}}
        contextMenuHidden={true}
      />
    </View>
  );

  const renderPasswordTerms = () => {
    const {
      length,
      upperCase,
      lowerCase,
      oneNumber,
      oneSpecialChar,
      noSpaces,
      isMatch,
    } = passwordConstraints;
    const passwordConsts = [
      length ?? false,
      oneNumber ?? false,
      upperCase ?? false,
      lowerCase ?? false,
      oneSpecialChar ?? false,
      noSpaces ?? false,
      isMatch ?? false,
    ];
    return (
      <View style={selectStyle('passwordTermsContainer')}>
        <Typography
          customStyles={() => ({text: selectStyle('passwordTermsHeader')})}>
          {tempTranslate(passwordRules[0].en, passwordRules[0].ar)}
        </Typography>

        {passwordRules?.slice(1)?.map((item, index) => (
          <View style={selectStyle('checkName')}>
            <SvgView
              svgFile={creditech.checkedBox}
              width={15}
              height={15}
              fill={
                passwordConsts[index] ? common.lightGreen : common.lightSilver
              }
            />

            <Typography
              customStyles={() => ({
                text: {
                  ...selectStyle('passwordTermsText'),
                },
              })}>
              {tempTranslate(item.en, item.ar)}
            </Typography>
          </View>
        ))}
      </View>
    );
  };

  const renderSignUpButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <DefaultButton
          loading={isLoading}
          disabled={!formValid}
          title={
            changePassword ? translate('UPDATE_PASSWORD') : translate('SIGNUP')
          }
          onPress={fromScreen === 'signUp' ? onRegister : onLogin}
          buttonStyle={[
            !userStoredPhone && fromScreen === 'signUp' && {width: wp(290)},
          ]}
        />

        {!userStoredPhone && fromScreen === 'signUp' && biometricOnDevice ? (
          <Biometric
            setIsLoading={setIsLoading}
            setCanCreateBiometric={val => {
              setCanCreateBioMetric(val);
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={selectStyle('mainContainer')}>
      <NavigationHeader
        title={
          changePassword
            ? translate('UPDATE_PASSWORD')
            : translate('CREATE_PASSWORD')
        }
      />

      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <Typography
          customStyles={() => ({
            text: selectStyle('titleText'),
          })}>
          {changePassword
            ? translate('UPDATE_PASSWORD')
            : translate('PLEASE_CREATE_PASSWORD')}
        </Typography>

        {renderPasswordField(
          password,
          setPassword,
          translate('TYPE_YOUR_PASSWORD'),
          showPass ? creditech.Eye : creditech.EyeClosed,
          () => setShowPass(!showPass),
          !showPass,
        )}

        {renderPasswordField(
          confirmPassword,
          setConfirmPassword,
          translate('CONFIRM_YOUR_PASSWORD'),
          showConfirmedPass ? creditech.Eye : creditech.EyeClosed,
          () => setShowConfirmedPass(!showConfirmedPass),
          !showConfirmedPass,
        )}

        {renderPasswordTerms()}
      </KeyboardAwareScrollView>

      <BottomContainer>{renderSignUpButton()}</BottomContainer>

      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};
