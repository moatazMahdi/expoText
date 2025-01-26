import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Linking,
  Dimensions,
  I18nManager,
  Modal,
  Alert,
} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ConnectionsProvider,
  StoresProvider,
  ProviderBridge,
  LocalizationProvider,
} from 'components';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotificationNavigation} from 'rnfn/firebase-notifications';
import {useLocalization, useRootNavigationUtils, useStores} from 'hooks';
import {ROUTES} from '../routes';
import LoginAlertModal from '../../components/LoginAlertModal';
import {ApplicationAnalytics} from '../../utils/firebaseUtils';
import SessionExpiredModal from 'src/components/SessionExpiredModal';
import {useNetInfo} from '@react-native-community/netinfo';
import NoInternetConnection from 'src/components/NoInternetConnection';
import { AppOnboarding } from 'screens';
const spacing = (Dimensions.get('window').height * 10) / 812;
var styles = StyleSheet.create({
  WhatsApp: {
    position: 'absolute',
    bottom: spacing * 7,
  },
  image: {
    height: spacing * 5,
    width: spacing * 5,
  },
  close: {
    position: 'absolute',
    bottom: spacing * 11,
  },
  closeImage: {
    height: spacing * 2,
    width: spacing * 2,
  },
});
const spacingHorizontal = (Dimensions.get('window').width * 10) / 375;

const Navigator = createNativeStackNavigator();
const ONBOARDING_KEY = 'hasSeenOnboarding';

// const entries = Object.entries(ROUTES);

const ScreensGenerator = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

useEffect(() => {
  const checkOnboardingStatus = async () => {
    const seenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
    setHasSeenOnboarding(seenOnboarding === 'true');
  };

  checkOnboardingStatus();
}, []);

if (hasSeenOnboarding === null) {
  return null;
}

const entries = Object.entries(ROUTES).filter(([key]) => {
  if (key === 'AppOnboarding') {
    return !hasSeenOnboarding;
  }
  return true;
});

  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {entries.map(item => (
        <Navigator.Screen
          options={{
            headerShown: false,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
          name={item[0]}
          component={item[1]}
          key={item[0]}
        />
      ))}
    </Navigator.Navigator>
  );
};

export interface NotificationNavigationWithNavigatorProps {
  rootNavigator: React.MutableRefObject<NavigationContainerRef | null>;
}

const NotificationNavigationWithNavigator: React.FC<
  NotificationNavigationWithNavigatorProps
> = props => {
  const {rootNavigator} = props;
  const {navigateTo} = useRootNavigationUtils(rootNavigator);
  return <NotificationNavigation navigateTo={navigateTo} />;
};

export const AppNavigationContainer: React.FC<{
  routingInstrumentation: any;
}> = props => {
  const {routingInstrumentation} = props;
  const stores = useStores();
  const routeNameRef = useRef<any>();
  const rootNavigator = useRef<NavigationContainerRef | null>(null);
  const [dynamicLinkFound, setDynamicLinkFound] = useState('');

  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state: any) => {
  //     setIsConnected(state.isConnected && state.isInternetReachable);
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [isConnected]);
  // useEffect(() => {
  //   // Check connectivity only when isConnected or isInternetReachable changes
  //   if (netInfo.isConnected != null && netInfo.isInternetReachable != null) {
  //     // Delay update to avoid false negatives during connection transitions
  //     const timeoutId = setTimeout(() => {
  //       // Ensure isConnected is always a boolean
  //       setIsConnected(!!(netInfo.isConnected && netInfo.isInternetReachable));
  //     }, 1000); // 1-second delay to handle fluctuations

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [netInfo.isConnected, netInfo.isInternetReachable]);

  const writeLinkToStorage = async (value: string) => {
    try {
      // analytics().logEvent('dynamicLinks', { name: value });
      ApplicationAnalytics(
        {
          eventKey: `dynamicLinks`,
          type: 'CTA',
          parameters: {link: value},
        },
        stores,
      );
      setDynamicLinkFound(value);
      await AsyncStorage.setItem('dynamicLink', value);
    } catch (e) {
      console.log('writeLinkToStorage error: ', e);
    }
  };

  useEffect(() => {
    if (dynamicLinkFound) {
      setDynamicLinkFound('');
    }
  }, [dynamicLinkFound]);

  const handleDynamicLink = link => {
    setDynamicLinkFound(link?.url);
    writeLinkToStorage(link?.url);
  };

  const checkIntialLink = async () => {
    try {
      dynamicLinks()
        .getInitialLink()
        .then(link => {
          link && writeLinkToStorage(link?.url);
        })
        .catch(e => {
          console.log('checkIntialLink error: ', e);
        });
    } catch (e) {
      console.log('checkIntialLink error: ', e);
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    checkIntialLink();
    return () => unsubscribe();
  }, []);

  const storesRef = useRef();
  return (
    <StoresProvider ref={storesRef}>
      <NavigationContainer
        ref={ref => (rootNavigator.current = ref)}
        onReady={() => {
          routeNameRef.current = rootNavigator.current?.getCurrentRoute()?.name;
          routingInstrumentation.registerNavigationContainer(
            rootNavigator.current,
          );
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          let currentRouteName = rootNavigator.current?.getCurrentRoute()?.name;

          try {
            ApplicationAnalytics(
              {
                eventKey: currentRouteName,
                type: 'NAVIGATION',
                parameters: {PreviousScreenName: previousRouteName},
              },
              stores,
              storesRef,
            );
          } catch (error) {}

          if (previousRouteName !== currentRouteName) {
            analytics().logScreenView({
              screen_name: `c_${currentRouteName}`,
            });
          }
        }}>
        {/* <NotificationNavigationWithNavigator rootNavigator={rootNavigator} /> */}
        <ConnectionsProvider>
          <LocalizationProvider>
            <ProviderBridge>
              <ScreensGenerator />
              <LoginAlertModal
                dynamicLink={dynamicLinkFound}
                rootNavigator={rootNavigator}
              />
              {/* {isConnected || isConnected == null ? null : (
                <Modal visible={!isConnected}>
                  <NoInternetConnection />
                </Modal>
              )} */}
              <SessionExpiredModal rootNavigator={rootNavigator} />
            </ProviderBridge>
          </LocalizationProvider>
        </ConnectionsProvider>
      </NavigationContainer>
    </StoresProvider>
  );
};

export const WhatsApp: React.FC = React.memo(function () {
  const stores = useStores();
  const {translate} = useLocalization();
  const [show, setShow] = useState(false);

  const openWhatsApp = async () => {
    let string = translate('HELP');
    Linking.openURL(`whatsapp://send?text=${string}&phone=+20216177`).catch(
      () =>
        Alert.alert('', translate('NO_WHATSAPP'), [
          {text: translate('GENERIC_CONFIRM')},
        ]),
    );
    ApplicationAnalytics({eventKey: 'whatsApp_opened', type: 'STATUS'}, stores);
  };
  const toggleWhats = async () => {
    setShow(!show);
    ApplicationAnalytics({eventKey: 'whatsApp_closed', type: 'STATUS'}, stores);
  };

  useEffect(() => {
    setShow(true);
  }, []);

  if (show) {
    return (
      <View>
        <Pressable
          style={[
            styles.WhatsApp,
            I18nManager.isRTL
              ? {left: spacingHorizontal * 2}
              : {right: spacingHorizontal * 2},
          ]}
          onPress={() => {
            openWhatsApp();
          }}>
          <Image
            style={styles.image}
            source={require('assets/images/screens/whatsapp/whatsapp.png')}></Image>
        </Pressable>
        <Pressable
          style={[
            styles.close,
            I18nManager.isRTL
              ? {left: spacingHorizontal * 1}
              : {right: spacingHorizontal * 1},
          ]}
          onPress={() => {
            toggleWhats();
          }}>
          <Image
            style={styles.closeImage}
            source={require('assets/images/screens/whatsapp/cance.png')}></Image>
        </Pressable>
      </View>
    );
  } else {
    return null;
  }
});
