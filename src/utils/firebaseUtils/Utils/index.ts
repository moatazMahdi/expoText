import {utils} from '@react-native-firebase/app';
import {PlayServicesAvailability} from './types';
import analytics from '@react-native-firebase/analytics';
import {AppEventsLogger} from 'react-native-fbsdk-next';
import ReactMoE, {MoEProperties} from 'react-native-moengage';

export class Utils {
  static playServicesAvailability: PlayServicesAvailability =
    utils().playServicesAvailability;
}
// type StringObject = Record<string, string | number | Array<any>>;

export const ApplicationAnalytics = async (
  data: {
    eventKey: string;
    parameters?: any;
    fbStandard?: boolean;
    type?: string;
  },
  stores?,
  storesRef?,
) => {
  if (__DEV__) return;

  const {eventKey, parameters, fbStandard, type} = data || {};
  const formattedEventKey = eventKey.replace(/[\s-]+/g, '_').substring(0, 39);
  const firebaseAnalytics = async () => {
    try {
      await analytics().logEvent(`c_${formattedEventKey}`, parameters);
    } catch (error) {
      console.log('ANALYTICS error in FireBase', error.response.data.message);
    }
  };

  const fbAnalytics = () => {
    try {
      fbStandard
        ? AppEventsLogger.logEvent(formattedEventKey, parameters)
        : AppEventsLogger.logEvent('c_' + formattedEventKey, parameters);
    } catch (error) {
      console.log('ANALYTICS error in FB', error);
    }
  };

  const moengageAnalytics = () => {
    let properties = new MoEProperties();
    if (parameters) {
      try {
        parameters &&
          Object.keys(parameters)?.forEach(key => {
            properties.addAttribute(key, parameters[key]);
          });
      } catch (error) {
        console.log('MOE error', error);
      }
    }
    ReactMoE.trackEvent(`c_${formattedEventKey}`, properties);
  };

  const logEvents = () => {
    if (!fbStandard) {
      firebaseAnalytics();
      moengageAnalytics();
    }
    fbAnalytics();
  };

  try {
    if (stores && storesRef) {
      const key = formattedEventKey;
      const userId = storesRef.current.rootStore.backend.users.userData?.id;
      const phone = storesRef.current.rootStore.backend.users.userData?.phone;

      await storesRef.current.rootStore.backend.general.contactLogEvent({
        key: key,
        userId,
        phone,
        type: type,
        parameters: {PreviousScreenName: parameters?.PreviousScreenName},
      });
    } else if (stores) {
      const key = formattedEventKey;
      const userId = stores.backend.users.userData?.id;
      const phone = stores.backend.users.userData?.phone;
      switch (type) {
        case 'CTA':
          await stores.backend.general.contactLogEvent({
            key: key,
            userId: userId,
            phone: phone,
            type: type,
            parameters: parameters
              ? {
                  ...parameters,
                }
              : {},
          });
          break;
        case 'STATUS':
          await stores.backend.general.contactLogEvent({
            key: key,
            userId: userId,
            phone: phone,
            type: type,
            parameters: parameters
              ? {
                  ...parameters,
                }
              : {},
          });
          break;
      }
    }

    logEvents();
  } catch (error) {
    console.log(`ANALYTICS error in ${formattedEventKey}`, error);
  }
};
