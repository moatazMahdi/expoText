import React, {useEffect, useMemo, useState} from 'react';
import {View, I18nManager, Pressable} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useStores, useLocalization, useNavigationUtils} from 'hooks';
import {BottomContainer} from 'src/components/BottomContainer';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {checkBiometric} from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import {Typography, useStyles} from 'elephanz-rn-ui';
import RowView from 'src/components/Wrappers/RowView';
import AsyncSetup from 'src/utils/OnboardingLogic';
import Biometric from 'src/components/Biometric';
import {LANGUAGES} from 'shared';
import {useNetInfo} from '@react-native-community/netinfo';
import {Assets} from 'assets';
import styles from './styles';

export const NewOnboardingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [biometricOnDevice, setBiometricOnDevice] =
    React.useState<boolean>(false);

  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const stores = useStores();

  const {staticTexts} = stores.backend.staticTexts;
  const currentVersion = useMemo(() => DeviceInfo.getVersion(), []);
  const {translate, currentLanguage, updateTranslations, setLanguage} =
    useLocalization();
  const hideContinue = stores.backend.auth.getContinueAsAGuestFlag();
  const isTextLoading = translate('LOGIN/SIGNUP')?.length === 0;

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const netInfo = useNetInfo();

  const onStart = () => {
    checkBiometric().then(res => setBiometricOnDevice(res.available));
    (async () => {
      await AsyncSetup(
        stores,
        staticTexts,
        setLanguage,
        updateTranslations,
        currentVersion,
        navigation,
        translate,
      );
    })();
  };

  // useEffect(() => {
  //   SplashScreen.hide();
  //   const unsubscribe = NetInfo.addEventListener((state: any) => {
  //     if (state.isConnected && state.isInternetReachable) {
  //       onStart();
  //     }
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    // Check connectivity only when isConnected or isInternetReachable changes
    if (netInfo.isConnected != null && netInfo.isInternetReachable != null) {
      // Delay update to avoid false negatives during connection transitions
      const timeoutId = setTimeout(() => {
        // Ensure isConnected is always a boolean
        onStart();
      }, 1000); // 1-second delay to handle fluctuations

      return () => clearTimeout(timeoutId);
    }
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  const onNavigateLoginSignup = async () => {
    ApplicationAnalytics({eventKey: 'Login_Signup', type: 'CTA'}, stores);
    navigation.navigate('login', {canCreateBioMetric: false});
  };

  const onSkipLogin = async () => {
    ApplicationAnalytics(
      {eventKey: 'continue_as_a_guest', type: 'CTA'},
      stores,
    );
    stores.backend.users.setRole('GUEST');
    navigation.navigate('welcome');
  };

  const renderContinueText = () => (
    <DefaultButton
      variant="secondaryBackground"
      mt={15}
      onPress={onSkipLogin}
      title={translate('CONTINUE_AS_A_GUEST')}
    />
  );

  const onLanguageChange = () => {
    const targetLanguage =
      currentLanguage.key === 'en' ? LANGUAGES[1] : LANGUAGES[0];
    ApplicationAnalytics(
      {
        eventKey: 'change_language',
        type: 'CTA',
        parameters: {
          targetLanguage: targetLanguage,
          fromScreen: 'Sign-up/Log-in',
        },
      },
      stores,
    );
    setIsLoading(true);
    updateTranslations(targetLanguage)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const checkUpdate = () => {
    navigation.navigate('checkUpdate');
  };
  const renderLang = () => {
    return (
      <View style={selectStyle('languageContainer')}>
        {/* <Pressable
        style={selectStyle('updateContainer')}
          hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          onPress={checkUpdate}>
          <Typography colorHex="white" fontSize={14} fontWeight={'500'}>
            Update
          </Typography>
        </Pressable> */}

        <Pressable
          hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          onPress={onLanguageChange}>
          <Typography colorHex="orange">
            {I18nManager.isRTL ? 'EN' : 'AR'}
          </Typography>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[selectStyle('mainContainer')]}>
      {renderLang()}

      <View style={selectStyle('lottieView')}>
        <AnimatedLottieView
          resizeMode="cover"
          source={creditech.welcomeLottie}
          autoPlay
          loop={false}
        />
      </View>

      {isTextLoading ? null : (
        <BottomContainer style={selectStyle('bottomContainer')}>
          <RowView ai="center" jc="center">
            <DefaultButton
              title={translate('LOGIN/SIGNUP')}
              buttonStyle={[biometricOnDevice && {width: '80%'}]}
              onPress={onNavigateLoginSignup}
            />

            {biometricOnDevice && <Biometric setIsLoading={setIsLoading} />}
          </RowView>

          {!hideContinue && renderContinueText()}
        </BottomContainer>
      )}

      {isLoading || isTextLoading ? <DefaultOverLayLoading /> : null}
    </View>
  );
};
