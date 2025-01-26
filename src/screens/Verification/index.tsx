import React, {useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  I18nManager,
  TouchableWithoutFeedback,
  Alert,
  Keyboard,
  Linking,
} from 'react-native';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import styles from './styles';
import NavigationHeader from 'src/components/NavigationHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ContinueButton, PageTitle} from 'components';
import {useRoute} from '@react-navigation/native';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {DigitalFatortyOptionTypes} from 'src/Types';
import {hp} from 'src/utils/Dimensions/dimen';
import DefaultButton from 'src/components/DefaultButton';
// import { DigitalFatortyOptionTypes, WalletForm, WalletTypeOptions } from 'src/Types';

export const Verification: React.FC = () => {
  const codeInputLength = 5;
  const [confirmCode, setConfirmCode] = React.useState<string>('');
  const [resendNumber, setResendNumber] = React.useState<number>(1);
  const textInputRef = React.useRef<TextInput | null>();
  const [completeForm, setCompleteForm] = React.useState<boolean>(false);
  const [confirmCodeResendTimer, setConfirmCodeResendTimer] =
    React.useState<number>(60);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const stores = useStores();
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {
    phoneNumber,
    fromScreen,
    otpResEncoded,
    name,
    canCreateBioMetricFromLogin,
    fatortyAmount,
    invoiceNo,
    invoiceUrl,
    nID,
    mobileNumber,
    walletType,
    bankName,
    bankCode,
    accountNumber,
    invoiceId,
    fatortyAdminFees,
    adminFeesValue,
  } = (useRoute().params as any) || {};
  const changePassword = useRoute().params?.changePassword;
  const [encodedData, setEncodedData] = React.useState<string>(otpResEncoded);

  const {userData} = stores.backend.users;

  const {translate} = useLocalization();

  const [screenTitle, setScreenTitle] = React.useState('');

  useEffect(() => {
    if (confirmCode && confirmCode.length === codeInputLength) {
      setCompleteForm(true);
    } else {
      setCompleteForm(false);
    }
  }, [confirmCode]);
  const fromFatorty =
    fromScreen === 'digitalFatortyBankTransfer' ||
    fromScreen === 'digitalFatortyOptions';
  useEffect(() => {
    textInputRef.current.focus();
    if (fromFatorty) {
      setScreenTitle(translate('OTP_SCREEN'));
    } else {
      changePassword
        ? setScreenTitle(translate('UPDATE_PASSWORD'))
        : setScreenTitle(translate('REGISTRATION_CREATE'));
    }
  }, []);

  const confirmPhoneNumberWithCodeAndLogin = async () => {
    Keyboard.dismiss();
    const code = confirmCode;
    setIsLoading(true);
    try {
      // First verify the code
      const verifyOTP = await stores.backend.auth.verifyPhoneOTP(
        phoneNumber,
        encodedData,
        code,
        fromScreen === 'signUp'
          ? 'register'
          : fromScreen === 'forgotPassword'
          ? 'forgotPassword'
          : fromScreen === 'login'
          ? 'login'
          : fromFatorty
          ? 'digitalFatorty'
          : 'biometric',
      );
      // Then create a new password and login
      if (verifyOTP?.data?.verificationToken) {
        ApplicationAnalytics(
          {
            eventKey: 'Activation',
            type: 'CTA',
            parameters: {
              actionName: 'Correct_OTP',
              journey: changePassword ? 'updatePassword' : 'signup',
            },
          },
          stores,
        );
        if (fromScreen === 'digitalFatortyOptions') {
          try {
            await stores.backend.users
              .transferDigitalFatorty({
                nationalId: nID,
                name: userData?.name,
                mobile: userData?.phone,
                email: userData?.email,
                accountNumber: mobileNumber,
                type: DigitalFatortyOptionTypes.WALLET,
                fatortyAmount:
                  '' + (fatortyAmount - fatortyAdminFees - adminFeesValue),
                invoiceNo,
                invoiceUrl,
                WalletType: walletType,
                invoiceOcrId: invoiceId,
              })
              .then(() => {
                navigation.navigate('digitalFatortyApprovalMessage');
              });
          } catch (e) {
            navigation.navigate('fatortyErrorMessage');
          }
        } else if (fromScreen === 'digitalFatortyBankTransfer') {
          async function submitBankTransfer() {
            await stores.backend.users.transferDigitalFatorty({
              nationalId: userData?.nationalId,
              name: name,
              bankCode: bankCode,
              swiftCode: bankName,
              accountNumber: accountNumber,
              mobile: userData?.phone,
              email: userData?.email,
              fatortyAmount:
                '' + (fatortyAmount - fatortyAdminFees - adminFeesValue),
              type: DigitalFatortyOptionTypes.BANK,
              invoiceNo,
              invoiceUrl,
              invoiceOcrId: invoiceId,
            });
          }
          submitBankTransfer()
            .then(() => {
              navigation.navigate('digitalFatortyApprovalMessage');
            })
            .catch(e => {
              navigation.navigate('fatortyErrorMessage');
            });
        } else {
          navigation.navigate('createPassword', {
            phoneNumber,
            fromScreen,
            changePassword,
            name: name || '',
            canCreateBioMetricFromLogin,
            otpToken: verifyOTP?.data?.verificationToken,
          });
        }
      }
    } catch (error: any) {
      ApplicationAnalytics(
        {
          eventKey: 'Activation',
          type: 'CTA',
          parameters: {
            actionName: 'Wrong_OTP',
            journey: changePassword ? 'updatePassword' : 'signup',
          },
        },
        stores,
      );
      Alert.alert('', error?.response?.data?.message, [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (confirmCode && confirmCode.length === 5) {
      confirmPhoneNumberWithCodeAndLogin();
    }
  }, [confirmCode]);

  React.useEffect(() => {
    if (confirmCodeResendTimer > 0) {
      const delay = 1000;
      const interval = setTimeout(() => {
        setConfirmCodeResendTimer(confirmCodeResendTimer - 1);
      }, delay);

      return () => {
        clearTimeout(interval);
      };
    }
    return () => {};
  }, [confirmCodeResendTimer]);

  const onResendPressed = async () => {
    ApplicationAnalytics(
      {
        eventKey: 'Activation',
        type: 'CTA',
        parameters: {
          actionName: 'Resend_OTP',
          journey: changePassword ? 'updatePassword' : 'signup',
        },
      },
      stores,
    );

    if (confirmCodeResendTimer === 0) {
      setIsLoading(true);
      if (resendNumber === 4) {
        Alert.alert('', translate('CALL_CENTER'), [
          {onPress: () => Linking.openURL(`tel:${translate('HOT_LINE')}`)},
        ]);
      } else {
        try {
          setResendNumber(prev => prev + 1);
          const data = await stores.backend.auth.verifyPhoneNumber(
            phoneNumber,
            changePassword ? 'forgotPassword' : 'register',
            '2',
          );
          setEncodedData(data?.data?.otpResEncoded);
          setConfirmCodeResendTimer(60);
          setConfirmCode('');
        } catch (error: any) {
          let errorBody;
          if (
            error.response.data.message &&
            typeof error.response.data.message === 'object'
          ) {
            errorBody = error.response.data.message[0];
          } else if (error.response.data.message) {
            errorBody = error.response.data.message;
          }
          Alert.alert(translate('LOGIN_PHONE_ERROR_TITLE'), errorBody);
        }
      }
      setIsLoading(false);
    }
  };

  // render Code Verification Input
  const setConfirmCodeWithLimit = (value: string) => {
    const isNumber = !Number.isNaN(Number(value));
    if (isNumber && value.length <= codeInputLength) {
      setConfirmCode(value);
    }
  };

  const generateCodeFieldUnits = () => {
    const resultElements = [];
    const elementKey = (id: number) => `codeUnitField-${id}`;
    for (let index = 0; index <= codeInputLength - 1; index += 1) {
      if (index < confirmCode.length) {
        resultElements.push(
          <View
            key={elementKey(index)}
            style={selectStyle('codeFieldUnitContainerFull')}>
            <Text style={selectStyle('codeFieldUnitText')}>
              {confirmCode[index]}
            </Text>
          </View>,
        );
      } else {
        resultElements.push(
          <View
            key={elementKey(index)}
            style={selectStyle('codeFieldUnitContainerFull')}
          />,
        );
      }
    }
    return resultElements;
  };

  const renderCodeField = () => {
    const focusCodeField = () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    };
    return (
      <TouchableWithoutFeedback onPress={focusCodeField}>
        <View
          style={
            I18nManager.isRTL
              ? selectStyle('codeFieldContainerRTL')
              : selectStyle('codeFieldContainer')
          }>
          {generateCodeFieldUnits()}
          <TextInput
            ref={r => (textInputRef.current = r)}
            value={confirmCode}
            keyboardType="number-pad"
            onChangeText={setConfirmCodeWithLimit}
            style={selectStyle('codeFieldInput')}
            autoFocus
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderResendText = () => (
    <View style={selectStyle('resendTextContainer')}>
      <Typography customStyles={() => ({text: selectStyle('resendText')})}>
        {`${translate(
          'CODE_EXPIRES_IN',
        )} ${confirmCodeResendTimer} ${tempTranslate(
          'seconds.',
          'ثواني.',
        )} ${translate('EXPERIENCE_PROBLEMS')}`}{' '}
        <Typography
          customStyles={() => ({text: selectStyle('resendTextUnderLined')})}
          onPress={onResendPressed}>
          {translate('RESEND_CODE')}
        </Typography>
      </Typography>
    </View>
  );

  const renderFatortyResendText = () => {
    return !(confirmCodeResendTimer <= 0) ? (
      <Typography
        style={{
          color: '#98A2B3', // Use the default value for the color
          textAlign: 'center',
          fontFamily: 'Ping LCG',
          fontSize: 16,
          fontStyle: 'normal', // This is the default value for fontStyle and can be omitted
          fontWeight: '700',
          lineHeight: 24,
        }}>
        {translate('RESEND_OTP_CODE')}
        {' ' + confirmCodeResendTimer}
      </Typography>
    ) : (
      <Typography
        // customStyles={() => ({ text: selectStyle('resendTextUnderLined') })}
        style={{
          color: '#98A2B3', // Use the default value for the color
          textAlign: 'center',
          fontFamily: 'Ping LCG',
          fontSize: 16,
          fontStyle: 'normal', // This is the default value for fontStyle and can be omitted
          fontWeight: '700',
          lineHeight: 24,
          marginTop: hp(24),
        }}
        onPress={onResendPressed}>
        {translate('RESEND_CODE')}
      </Typography>
    );
  };

  const renderContinueButton = () => {
    return (
      <ContinueButton
        loading={isLoading}
        onContinuePressed={confirmPhoneNumberWithCodeAndLogin}
        completeForm={completeForm}
      />
    );
  };

  const renderDefaultButton = () => {
    return (
      <DefaultButton
        disabled={!completeForm}
        buttonStyle={{
          borderColor: '#98A2B3',
          borderBottomColor: '#98A2B3',
          marginTop: 'auto',
          marginBottom: hp(24),
        }}
        titleStyles={completeForm ? {color: 'white'} : {color: '#98A2B3'}}
        title="Verify"
        onPress={confirmPhoneNumberWithCodeAndLogin}></DefaultButton>
    );
  };
  //fromFatorty

  return (
    <View style={selectStyle('mainContainer')}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'white'}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={selectStyle('mainContainer')}>
        <NavigationHeader
          shapeVariant="orange"
          title={screenTitle}
          removeCapitalization={true}
        />

        {!fromFatorty ? (
          <PageTitle title={translate('ENTER_OTP')} />
        ) : (
          <View
            style={{
              margin: 24,
            }}>
            <Typography
              style={{
                color: '#020B19',
                fontFamily: 'Ping LCG',
                fontSize: 20,
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 32,
              }}>
              {translate('OTP_SCREEN_MESSAGE')}
            </Typography>
            {/* <Typography style={{
            color: '#020B19',
            fontFamily: 'Ping LCG',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: 18,
          }}>{`${translate('OTP_PROMPT')}`}
            <Typography
              style={
                {
                  color: '#020B19',
                  fontWeight: '700',
                }
              }
            >
              {" " + phoneNumber}
            </Typography>
          </Typography> */}
          </View>
        )}

        {fromFatorty ? renderCodeField() : renderCodeField()}
        {!fromFatorty ? renderResendText() : renderFatortyResendText()}
        {!fromFatorty ? renderContinueButton() : renderDefaultButton()}
      </KeyboardAwareScrollView>
      {isLoading && <DefaultOverLayLoading />}
    </View>
  );
};
