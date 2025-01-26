import React, {useEffect} from 'react';
import {
  View,
  I18nManager,
  Platform,
  Linking,
  ImageBackground,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Assets} from 'assets';
import {
  FirebaseNotifications,
  NotificationChannel,
  NativeNotification,
  navigateFromNotification,
  isNotificationRouteValid,
} from 'rnfn/firebase-notifications';
import {useStores, useLocalization, useNavigationUtils, getRoutes} from 'hooks';
import {useStyles} from 'elephanz-rn-ui';
import {Language, LANGUAGES} from 'shared';
import compareVersions from 'compare-versions';
import styles from './styles';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
// import ReactMoE from 'react-native-moengage';
import SvgView from 'src/components/SvgView';
import * as RNLocalize from 'react-native-localize';
import {SendMoEngageNotifications} from 'src/utils/HelpersFunctions';

// const MINIMUM_VERSION = '2.5.0'; //IOS
const MINIMUM_VERSION = '2.5.2'; //ANDROID

const NOTIFICATION_CHANNELS = [
  new NotificationChannel(
    'Main Channel',
    'main-channel',
    'Main Channel',
    'default',
  ),
] as const;

const notificationSetup = async stores => {
  // try {
  // ReactMoE.setEventListener('pushClicked', notificationPayload => {
  // ApplicationAnalytics(
  //   {
  //     eventKey: 'notification_clicked',
  //     type: 'CTA',
  //     parameters: {
  //       campaignData: notificationPayload?.payload?.moe_cid_attr,
  //     },
  //   },
  //   stores,
  // );
  // });
  // } catch (e) {}
  try {
    FirebaseNotifications.createNotificationsChannels(NOTIFICATION_CHANNELS);
    FirebaseNotifications.onTokenRefresh(token => {
      console.log('NOTIFICATIONS_MODULE', 'token changed', token);
    });
    FirebaseNotifications.onNotificationOpenedApp(async notification => {
      console.log(
        'NOTIFICATIONS_MODULE',
        'notification opened app',
        notification,
      );
    });
    FirebaseNotifications.setBackgroundMessageHandler(async () => {
      SendMoEngageNotifications(stores);
    });
    FirebaseNotifications.onMessage(async message => {
      SendMoEngageNotifications(stores);
      try {
        const {notification} = message;
        console.log(
          'NOTIFICATIONS_MODULE',
          'notification received',
          notification,
        );
        // ReactMoE.passFcmPushPayload(notification?.data);
        NativeNotification.presentLocalNotification({
          alertBody: notification.body,
          alertTitle: notification.title,
        });
        console.log(
          'NOTIFICATIONS_MODULE',
          'notification presented',
          notification,
        );
        if (Platform.OS === 'android') {
          notification.android.channelId = notification.data.channelId;
          notification.android.smallIcon = 'ic_launcher';
        }
      } catch (error) {
        console.log('NOTIFICATIONS_MODULE', 'onMessage error', error);
      }
    });
  } catch ({response}) {
    console.error('NOTIFICATIONS_MODULE', 'error', response);
  }
};

export const SplashScreen: React.FC = () => {
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;
  const stores = useStores();
  const {setLanguage, updateTranslations, currentLanguage} = useLocalization();
  const navigation = useNavigationUtils();
  const {selectStyle} = useStyles(styles);
  const {staticTexts} = stores.backend.staticTexts;

  const initLocalization = async () => {
    // Should be uncommented when we have translations for all languages
    let language: Language = stores.ui.localization.currentLanguage;

    if (!language) {
      const deviceLocales = RNLocalize.getLocales();
      const languageIndex =
        deviceLocales.length > 0 && deviceLocales[0].languageCode === 'ar'
          ? 1
          : 0;
      language = LANGUAGES[languageIndex];
    }
    // let language: Language = LANGUAGES[0];
    if (language.isRTL !== I18nManager.isRTL) {
      setLanguage(language, {});
    }
    if (staticTexts.data && staticTexts.data.length) {
      updateTranslations(language);
    } else {
      await updateTranslations(language);
    }
  };

  const routeToAppropriateScreen = async () => {
    const currentVersion = DeviceInfo.getVersion();
    const isVersionValid = compareVersions.validate(MINIMUM_VERSION);
    const isCurrentVersionSufficient = compareVersions.compare(
      currentVersion,
      MINIMUM_VERSION,
      '>=',
    );
    // const logAnalytics = async (screen) => {
    //   ApplicationAnalytics(
    //     {
    //       eventKey: 'routeFromSplashScreenToAppropriateScreen',
    //       parameters: { ScreenName: screen },
    //       type:'NAVIGATION'
    //     },
    //     stores,
    //   );
    // };
    // if (isVersionValid && isCurrentVersionSufficient) {
    console.log('awaad');

    if (true) {
      // if (!stores.ui.onboarding.seenProperty) {
      //   await logAnalytics('onboarding');
      //   navigation.replace({ name: 'onboarding' });
      // } else
      if (['NONE']?.includes(stores.backend.users.role)) {
        // Navigate to login screen
        // await logAnalytics('onboarding');
        //  navigation.replace({ name: 'login' });
        navigation.replace({name: 'onboarding'});
      } else {
        // Navigate to Home page
        // await logAnalytics('home');
        navigation.replace({name: 'home'}); //, { name: 'tab1', params: { a: 1 } }
      }
    } else {
      // await logAnalytics('forceUpdate');
      navigation.replace({name: 'forceUpdate'});
    }
  };

  useEffect(() => {
    (async () => {
      const start = new Date().getTime();
      await notificationSetup(stores);
      await stores.hydrate();
      await initLocalization();
      const userData = stores.backend.users.userData;
      if (userData?.id) {
        /**
         * simple fix for setting the token before navigating to home.
         * axios was built on relying on a failing request to refresh and set the token
         * this caused issues in home screen where the token was not set yet
         *  */
        // stores.backend.wallet.userWallet.fetch(userData.id.toString());
        // stores.backend.users.getUserById(userData.id);
        // stores.backend.users.userNotifications
        stores.backend.users.userNotifications.fetch();
      }

      // Give the animation time
      const delay = 1000 - (new Date().getTime() - start);
      if (delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }
      const initialNotification =
        await FirebaseNotifications.getInitialNotification();
      if (isNotificationRouteValid(initialNotification)) {
        if (initialNotification.data?.screenName?.includes('secret::')) {
          Linking.openURL(
            initialNotification.data?.screenName
              .split('/secret::')[1]
              .split('_')
              ?.join('/'),
          );
          setTimeout(() => {
            navigation.navigateToScreen('home');
          }, 100);
        } else {
          navigateFromNotification(initialNotification, args => {
            const route = getRoutes(args);
            navigation.replace({name: 'home'});
            setTimeout(() => {
              navigation.navigateToScreen(route);
            }, 10);
          });
          return;
        }
      }
      routeToAppropriateScreen();
      // navigation.navigateToScreen('scanNID');
    })();
  }, []);

  if (!currentLanguage) {
    return null;
  }

  return (
    <View style={selectStyle('container')}>
      <ImageBackground
        source={creditech.splashBackground}
        imageStyle={selectStyle('backgroundContainer')}
        style={selectStyle('backgroundContainer')}>
        <SvgView svgFile={creditech.ContactNow} width={240} height={240} />
      </ImageBackground>
    </View>
  );
};
