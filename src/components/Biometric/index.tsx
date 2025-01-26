import React, {useEffect} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactMoE from 'react-native-moengage';
import {checkBiometric, clearBiometric} from 'src/utils/HelpersFunctions';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {useStyles} from 'elephanz-rn-ui';
import SvgView from '../SvgView';
import {Assets} from 'assets';
import styles from './styles';

interface BiometricInterface {
  setIsLoading?: any;
  setCanCreateBiometric?: (canActivateBiometric: boolean) => void;
}

const Biometric: React.FC<BiometricInterface> = props => {
  const {setIsLoading, setCanCreateBiometric} = props;

  const [biometricTypeText, setBiometricTypeText] = React.useState<
    'FINGER_PRINT' | 'FACE_ID'
  >('FINGER_PRINT');

  const {translate} = useLocalization();
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const stores = useStores();

  const Biometrics = new ReactNativeBiometrics();

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  useEffect(() => {
    checkBiometric().then(res => {
      if (res.type === 'face') setBiometricTypeText('FACE_ID');
      else if (res.type === 'touch') setBiometricTypeText('FINGER_PRINT');
    });
  }, []);

  const handleBiometricLogin = async (
    signature: string,
    registeredBiometricUserPhone: string,
  ) => {
    try {
      const userCredentials = await stores.backend.auth.BiometricLogIn(
        registeredBiometricUserPhone?.slice(2),
        signature,
      );
      stores.backend.users.setRole('USER');
      await stores.backend.auth.setHideContinueAsGuest(true);
      stores.backend.users.setRegistered(true);
      try {
        await stores.backend.users.getUserById(userCredentials.userId);
        const user = stores.backend.users?.userData;
        ReactMoE.setUserUniqueID(`${user?.id}`);
        ApplicationAnalytics(
          {eventKey: 'user_login_by_biometric', type: 'CTA'},
          stores,
        );
        navigation.resetTo({name: 'home'});
      } catch (error) {
        setIsLoading(false);
        stores.backend.auth.setAccessToken('');
        Alert.alert('', translate('ERROR'), [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      }
    } catch ({response}) {
      setIsLoading(false);
      if (response?.status === 403) {
        try {
          const verifyPhoneCodeRes =
            await stores.backend.auth.verifyPhoneNumber(
              registeredBiometricUserPhone.slice(2),
              'biometric',
              'biometric'
            );
          navigation.navigate('verification', {
            phoneNumber: registeredBiometricUserPhone.slice(2),
            fromScreen: 'onboarding',
            otpResEncoded: verifyPhoneCodeRes?.data?.otpResEncoded,
            canCreateBioMetricFromLogin: false,
          });
        } catch (error) {}
      } else {
        Alert.alert('', response?.data?.message, [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      }
    }
  };

  const navToLoginToActivate = () => {
    ApplicationAnalytics(
      {eventKey: 'user_register_biometric_onboarding', type: 'STATUS'},
      stores,
    );
    navigation.navigate('login', {canCreateBioMetric: true});
  };

  const biometricActivation = (success: boolean) => {
    if (success) {
      if (setCanCreateBiometric) {
        setCanCreateBiometric(true);
      } else {
        Alert.alert(
          translate(`${biometricTypeText}_ACTIVATION`),
          translate(`TO_COMPLETE_${biometricTypeText}_ACTIVATION`),
        );
        navToLoginToActivate();
      }
    } else {
      Alert.alert(
        translate(`${biometricTypeText}_ACTIVATION`),
        translate(`${biometricTypeText}_ACTIVATION_CANCELED`),
      );
      setCanCreateBiometric ? setCanCreateBiometric(false) : null;
    }
  };

  const handleBiometricIconPress = async () => {
    const registeredBiometricUserPhone = await AsyncStorage.getItem(
      'hasBiometric',
    );


    if (registeredBiometricUserPhone) {
      Biometrics.createSignature({
        promptMessage: translate(`USER_${biometricTypeText}_TO_LOGIN`),
        payload: `${registeredBiometricUserPhone}`,
      })
        .then(async resultObject => {
          const {success, signature} = resultObject;
          if (success) {
            ApplicationAnalytics(
              {
                eventKey: 'user_success_biometric_attempt',
              },
              stores,
            );

            setIsLoading(true);

            let checkPrivate =
              await stores.backend.auth.CheckBiometricPrivateKey(
                registeredBiometricUserPhone?.slice(2),
              );

            //checkPrivate = { hasBiometric: false };

            if (checkPrivate?.hasBiometric) {
              ApplicationAnalytics({eventKey: 'user_has_biometric'}, stores);

              handleBiometricLogin(
                signature || '',
                registeredBiometricUserPhone,
              );
            } else {
              try {
                await stores.backend.auth.DeleteBiometricPrivateKey(
                  registeredBiometricUserPhone?.slice(2),
                );
              } catch (err) {
              } finally {
                clearBiometric();
                biometricActivation(success);
                setIsLoading(false);
              }
            }
          } else {
            ApplicationAnalytics(
              {
                eventKey: 'user_fail_biometric_attempt',
              },
              stores,
            );
            //TODO alert for failed
            setIsLoading(false);
          }
        })
        .catch(async error => {
          ApplicationAnalytics(
            {
              eventKey: 'user_fail_biometric_attempts',
            },
            stores,
          );
          setIsLoading(false);

          //TODO
          //alert ليست هناك بصمات إصبع مسجَّلة. No fingerprints enrolled
          // if (
          //   error?.message?.includes('مسجَّلة') ||
          //   error?.message?.includes('enrolled')
          // ) {
          // }

          if (
            error?.message?.includes('المحاولات') ||
            error?.message?.includes('attempts')
          ) {
            Alert.alert('', translate('BIOMETRIC_EXCEEDED_NUMBER_OF_ATTEMPTS'));
          }
        });
    }
    //Activation for biometric if there no key registered before
    else {
      Biometrics.simplePrompt({
        promptMessage: translate(`${biometricTypeText}_ACTIVATION`),
      })
        .then(async resultObject => {
          const {success} = resultObject;
          biometricActivation(success);
        })
        .catch(error => {
          ApplicationAnalytics(
            {eventKey: 'user_fail_biometric_attempts'},
            stores,
          );

          setCanCreateBiometric ? setCanCreateBiometric(false) : null;
          if (
            error?.message?.includes('المحاولات') ||
            error?.message?.includes('attempts')
          )
            Alert.alert(
              `${biometricTypeText}_ACTIVATION`,
              translate('EXCEEDED_NUMBER_OF_ATTEMPTS'),
            );
        });
    }
  };

  return (
    <TouchableOpacity
      style={selectStyle('container')}
      onPress={handleBiometricIconPress}>
      <SvgView
        svgFile={
          biometricTypeText === 'FINGER_PRINT'
            ? creditech.FingerPrint
            : creditech.FaceId
        }
        width={biometricTypeText === 'FINGER_PRINT' ? 20 : 25}
        height={biometricTypeText === 'FINGER_PRINT' ? 20 : 25}
      />
    </TouchableOpacity>
  );
};

export default Biometric;
