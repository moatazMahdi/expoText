import React, {useCallback, useEffect, useState} from 'react';
import {Text, LogBox, StatusBar} from 'react-native';
// import {AppNavigationContainer} from 'navigation';
// import {Settings} from 'settings';
// import {UpdatingProgressBar} from 'components';
// import codePush from 'react-native-code-push';
// import ReactMoE from 'react-native-moengage';
// import {enableLatestRenderer} from 'react-native-maps';
// import {Settings as FBSettings} from 'react-native-fbsdk-next';
import {Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { AppNavigationContainer } from '../navigation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Config from 'react-native-config';
// import JailMonkey from 'jail-monkey';
// import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
// import {checkRootAccess} from 'src/utils/HelpersFunctions';
// import * as Sentry from '@sentry/react-native';
// import uuid from 'react-native-uuid';
// import { fingerprintErrorMessage } from 'src/utils/SentryFingerprint';
// import {
//   MoEProperties,
//   MoEAppStatus,
//   MoEInitConfig,
//   MoEPushConfig,
//   MoEngageLogConfig,
//   MoEngageLogLevel,
// } from 'react-native-moengage';
// import {
//   PERMISSION_TYPE,
//   requestPermission,
// } from 'src/utils/PermissionsUtilities';

// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications
// const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
// const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

/**
 * From Sentry Documentation
 * Set tracesSampleRate to 1.0 to capture 100% of transactions,
 * We recommend adjusting this value in production.
 */
// Sentry.init({
//   dsn: `${Config.SENTRY_DSN}`,
//   tracesSampleRate: Config.ENV === 'production' ? 0 : 0,
//   dist: Platform.OS == 'android' ? '116' : '40',
//   release: '2.8.0',
//   debug: false,
//   environment: Config.ENV,
//   enableNative: true,
//   enabled: true,
//   enableNativeCrashHandling: true,
//   attachScreenshot: true,
//   attachStacktrace: true,
//   enableAutoSessionTracking: true,
//   enableAutoPerformanceTracking: true,
//   enableOutOfMemoryTracking: true,
//   maxBreadcrumbs: 50,
//   integrations: [
//     new Sentry.ReactNativeTracing({
//       routingInstrumentation,
//       traceXHR: true,
//       idleTimeout: 2000,
//     }),
//   ],
//   ignoreErrors: [
//     `null is not an object (evaluating 'k.default.isHMSAvailable')`,
//     `null is not an object (evaluating '_reactNativeHasHms.default.isHMSAvailable')`,
//     'Request failed with status code 500',
//     `Request failed with status code 401`,
//     `Request failed with status code 403`,
//     `Network request failed`,
//     `Network Error`,
//   ],
//   beforeSend(event: any, hint: any) {
//     if (event.level === 'fatal') {
//       event.extra = {
//         eventPriority: 'fatal errors that must be handled',
//       };
//       return event;
//     }
//     if (Config.ENV == 'development') {
//       return null;
//     }
//     const requestOrigin =
//       hint?.originalException?.request?.headers?.origin ||
//       hint?.event?.request?.headers?.origin;

//     if (requestOrigin && requestOrigin.includes('localhost')) {
//       return null;
//     }
//     if (
//       Platform.OS == 'ios' &&
//       event.exception?.values?.[0]?.stacktrace?.frames?.length
//     ) {
//       event.exception.values[0].stacktrace.frames =
//         event.exception.values[0].stacktrace.frames.map(frame => {
//           if (frame.filename && frame.filename.endsWith('.jsbundle')) {
//             frame.filename = 'app:///main.jsbundle';
//           }

//           return frame;
//         });
//     }

//     if (hint?.originalException instanceof Error) {
//       const error = hint.originalException;
//       event.fingerprint = [error.name, fingerprintErrorMessage(error.message)];
//     }

//     return event;
//   },
// });

const App: React.FC = () => {
  const [isRootAccess, setIsRootAccess] = useState(false);

  // const createSessionId = useCallback(async () => {
  //   await AsyncStorage.removeItem('sessionId');
  //   await AsyncStorage.setItem('sessionId', `${uuid.v4()}`);
  // }, []);

  // useEffect(() => {
  //   Settings.init();
  //   createSessionId();
  //   requestPermission(PERMISSION_TYPE.notification);
  //   const moEInitConfig = new MoEInitConfig(
  //     MoEPushConfig.defaultConfig(),
  //     new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, true),
  //   );
  //   ReactMoE.initialize('W79QXRFKLEDUZ7C6RTLIZXFU', moEInitConfig);
  //   ReactMoE.requestPushPermissionAndroid();
  //   ReactMoE.showInApp();
  //   // enableLatestRenderer();

  //   checkRootAccess().then(setIsRootAccess);

  //   // Setting the facebook app id using setAppID
  //   // Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
  //   try {
  //     FBSettings.setAppID('894697581918094');
  //   } catch (error) {
  //     console.log('FBSDK: ', error);
  //   }
  // }, [createSessionId]);

  // const handleRootAccess = useCallback(() => {
  //   const msg = isRootAccess ? 'rooted device' : 'jail-broken';
  //   ApplicationAnalytics({
  //     eventKey: msg,
  //     type: 'CTA',
  //   });
  //   Alert.alert('', msg);
  // }, [isRootAccess]);

  // if (!JailMonkey.isJailBroken() && !isRootAccess) {
    return (
      <SafeAreaProvider style={{flex: 1}}>
        <StatusBar
          animated
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'}
        />
        <Text>test</Text>
        <AppNavigationContainer
          routingInstrumentation={"home"}
        />
        {/* <UpdatingProgressBar /> */}
      </SafeAreaProvider>
    );
  // } else {
  //   handleRootAccess();
  //   return null;
  // }
};

export default App;

// export default codePush(codePushOptions)(Sentry.wrap(App));
// export default (Sentry.wrap(App));
