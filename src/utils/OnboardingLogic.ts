import {I18nManager, Linking, Platform} from 'react-native';
import {
  FirebaseNotifications,
  NotificationChannel,
  NativeNotification,
  navigateFromNotification,
  isNotificationRouteValid,
} from 'rnfn/firebase-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import compareVersions from 'compare-versions';
import ReactMoE from 'react-native-moengage';
import {PERMISSION_TYPE, requestPermission} from './PermissionsUtilities';
import {handleDynamicLink, SendMoEngageNotifications} from './HelpersFunctions';
import {ApplicationAnalytics} from './firebaseUtils';
import {LANGUAGES, Language} from 'shared';
import {getRoutes} from 'hooks';

const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  new NotificationChannel(
    'Main Channel',
    'main-channel',
    'Main Channel',
    'default',
  ),
];

const MINIMUM_VERSION = '2.10.0';

export const notificationSetup = async (
  stores: any,
  navigation: any,
  translate: any,
) => {
  try {
    ReactMoE.setEventListener('pushClicked', (notificationPayload: any) => {
      ApplicationAnalytics(
        {
          eventKey: 'notification_clicked',
          type: 'STATUS',
          parameters: {
            campaignData: notificationPayload?.payload?.moe_cid_attr,
          },
        },
        stores,
      );
    });
  } catch (error) {
    console.error('NOTIFICATIONS_MODULE - Error in notificationSetup:', error);
  }

  try {
    FirebaseNotifications.createNotificationsChannels(NOTIFICATION_CHANNELS);
    FirebaseNotifications.onTokenRefresh((token: string) => {
      console.log('NOTIFICATIONS_MODULE', 'token changed', token);
    });

    FirebaseNotifications.onNotificationOpenedApp(async notification => {
      console.log(
        'NOTIFICATIONS_MODULE',
        'notification opened app',
        notification,
      );

      if (notification?.data) {
        if (stores?.backend?.users?.role === 'USER')
          handleDynamicLink(
            {
              customDynamicLink: {
                key: notification?.data?.dynamicLinkKey,
                value: notification?.data?.dynamicLinkValue,
              },
            },
            stores,
            translate,
            navigation,
          );
        else {
          await AsyncStorage.setItem(
            'dynamicLinkKey',
            notification?.data?.dynamicLinkKey,
          );
          await AsyncStorage.setItem(
            'dynamicLinkValue',
            notification?.data?.dynamicLinkValue,
          );
          navigation.navigate('login');
        }
      }
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
        console.error('NOTIFICATIONS_MODULE - Error in onMessage:', error);
      }
    });
  } catch (error) {
    console.error('NOTIFICATIONS_MODULE - Error in notificationSetup:', error);
  }
};

export const initLocalization = async (
  staticTexts: any,
  setLanguage: (language: Language, options: any) => void,
  updateTranslations: (language: Language) => void,
  stores: any,
) => {
  // Uncomment when translations are available for all languages
  let language: Language = stores.ui.localization.currentLanguage;

  if (!language) {
    const deviceLocales = RNLocalize.getLocales();
    console.log({deviceLocales});

    const languageIndex =
      deviceLocales.length > 0 && deviceLocales[0].languageCode === 'ar'
        ? 1
        : 0;
    language = LANGUAGES[languageIndex];
  }

  if (language.isRTL !== I18nManager.isRTL) {
    setLanguage(language, {});
  }

  if (staticTexts.data && staticTexts.data.length) {
    updateTranslations(language);
  } else {
    try {
      updateTranslations(language);
    } catch (error) {
      console.error('Error in initLocalization:', error);
    }
  }
};

export const routeToAppropriateScreen = async (
  stores: any,
  currentVersion: string,
  navigation: any,
) => {
  const isVersionValid = compareVersions.validate(MINIMUM_VERSION);
  const accessToken = stores.backend.auth.getAccessToken();
  const isCurrentVersionSufficient = compareVersions.compare(
    currentVersion,
    MINIMUM_VERSION,
    '>=',
  );

  if (isVersionValid && isCurrentVersionSufficient) {
    if (['NONE', 'GUEST']?.includes(stores.backend.users.role)) {
      const link = await AsyncStorage.getItem('dynamicLink');
      link && stores.backend.auth.getContinueAsAGuestFlag() === true
        ? navigation.navigate('login')
        : link
        ? navigation.navigate('accessDenied', {navTo: 'login'})
        : null;
      await AsyncStorage.removeItem('dynamicLink');
    } else {
      try {
        if (accessToken) {
          await stores.backend.auth.validateAccessToken(accessToken);
          navigation.replace({name: 'home'});
        }
      } catch ({response}) {
        if (response?.status === 401) {
          try {
            await stores.backend.auth.refresh();
            navigation.replace({name: 'home'});
          } catch (e) {
            stores.backend.auth.logout();
          }
        }
      }
    }
  } else {
    navigation.replace({name: 'forceUpdate'});
  }
};

export default async function AsyncSetup(
  stores: any,
  staticTexts: any,
  setLanguage: (language: Language, options: any) => void,
  updateTranslations: (language: Language) => void,
  currentVersion: string,
  navigation: any,
  translate: any,
) {
  const start = new Date().getTime();

  await notificationSetup(stores, navigation, translate);
  await stores.hydrate();
  await initLocalization(staticTexts, setLanguage, updateTranslations, stores);

  const delay = 1000 - (new Date().getTime() - start);
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
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
  requestPermission(PERMISSION_TYPE.notification);

  routeToAppropriateScreen(stores, currentVersion, navigation);
}
