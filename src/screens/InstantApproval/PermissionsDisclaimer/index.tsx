import React, {useEffect, useState} from 'react';
import {Platform, View, PermissionsAndroid, Pressable} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {PageTitle} from 'components';
import {Assets} from 'assets';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ContinueLater} from 'src/components/ContinueLater';
import {requestMultiple, checkMultiple} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
// import AutoStart from 'react-native-autostart';
import {
  readArrayOfPermissionsListIOS,
  readArrayOfPermissionsListAndroid,
} from './Permissions';
import SvgView from 'src/components/SvgView';
import {BottomContainer} from 'src/components/BottomContainer';
import DefaultButton from 'src/components/DefaultButton';
import {
  saveInstantApprovalProgress,
  splitArray,
} from 'src/utils/HelpersFunctions';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {useNavigationState} from '@react-navigation/native';

import {baseScreen} from 'hoc';

const {
  images: {
    screens: {creditech},
  },
} = Assets;

const permissionsDisclaimer: React.FC = () => {
  const navigation = useNavigationUtils();
  const routes = useNavigationState(state => state.routes);
  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const stores = useStores();

  const [permissionsHideShow, setPermissionsHideShow] = useState(
    Platform.OS === 'android'
      ? [false, false, false, false, false, false, false, false]
      : [false, false, false, false],
  );
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (logs?.length > 0) {
      const logsList = splitArray(logs, 100);
      try {
        logsList.map(logsChunk => {
          stores.backend.instantApproval.collectContactsAndLogs({
            logs: logsChunk,
          });
        });
      } catch (error) {}
    }
  }, [logs]);

  const permissionsIOS = [
    {
      name: translate('VIEW_IMAGES'),
      description: translate('VIEW_IMAGES_DESC'),
    },
    {
      name: translate('LOCATION_SERVICES'),
      description: translate('LOCATION_SERVICES_DESC'),
    },
    // {
    // name: translate('CONTACTS'),
    // description: translate('CONTACTS_DESC'),
    // },
    {
      name: translate('DEVICES_AND_APP_HISTORY'),
      description: translate('DEVICES_AND_APP_HISTORY_DESC'),
    },
    {
      name: translate('REMINDERS'),
      description: translate('REMINDERS_DESC'),
    },
  ];

  const permissionsANDROID = [
    {
      name: translate('VIEW_IMAGES'),
      description: translate('VIEW_IMAGES_DESC'),
    },
    {
      name: translate('LOCATION_SERVICES'),
      description: translate('LOCATION_SERVICES_DESC'),
    },
    // {
    // name: translate('CONTACTS'),
    // description: translate('CONTACTS_DESC'),
    // },
    // {
    //   name: translate('SMS'),
    //   description: translate('SMS_DESC')
    // },
    {
      name: translate('DEVICES_AND_APP_HISTORY'),
      description: translate('DEVICES_AND_APP_HISTORY_DESC'),
    },
    {
      name: translate('IDENTITY'),
      description: translate('IDENTITY_DESC'),
    },
    {
      name: translate('PHONE_PERMISSION'),
      description: translate('PHONE_PERMISSION_DESC'),
    },
    {
      name: translate('DEVICE_ID_CALL_INFO'),
      description: translate('DEVICE_ID_CALL_INFO_DESC'),
    },
    {
      name: translate('RUN_AT_STARTUP'),
      description: translate('RUN_AT_STARTUP_DESC'),
    },
    {
      name: translate('VIEW_WIFI'),
      description: translate('VIEW_WIFI_DESC'),
    },
  ];

  useEffect(() => {
    ApplicationAnalytics(
      {
        eventKey: 'StartTrial',
        type: 'CTA',
        fbStandard: true,
        parameters: {
          fb_currency: 'EGP',
          ScreenName: routes[routes?.length - 2]?.name,
        },
      },
      stores,
    );
    //stores.backend.general.logEvent({key: 'StartTrial',});
  }, []);

  const permissionsArray =
    Platform.OS === 'ios' ? permissionsIOS : permissionsANDROID;
  const renderPermissionsList = () => {
    return (
      <View>
        {permissionsArray?.map((item, index) => {
          return (
            <View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Typography
                  customStyles={() => ({
                    text: selectStyle('PermissionsListTitle'),
                  })}>
                  {item.name}
                </Typography>
                <Pressable
                  //style={{backgroundColor:'red'}}
                  hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
                  onPress={() => {
                    let tempArr = [];
                    tempArr = permissionsHideShow?.slice();
                    tempArr[index] = !tempArr[index];
                    setPermissionsHideShow(tempArr);
                  }}>
                  {permissionsHideShow[index] ? (
                    <SvgView
                      svgFile={creditech.ExpandUp}
                      width={25}
                      height={25}
                      me={20}
                      fill="grey"
                    />
                  ) : (
                    <SvgView
                      svgFile={creditech.ExpandDown}
                      width={25}
                      height={25}
                      me={20}
                      fill="grey"
                    />
                  )}
                </Pressable>
              </View>
              <View style={selectStyle('PermissionsListDescriptionContainer')}>
                {permissionsHideShow[index] && (
                  <Typography
                    customStyles={() => ({
                      text: selectStyle('PermissionsListDescription'),
                    })}>
                    {item.description}
                  </Typography>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const acceptPermissions = async () => {
    const readArrayOfPermissionsList =
      Platform.OS === 'ios'
        ? readArrayOfPermissionsListIOS
        : readArrayOfPermissionsListAndroid;

    await checkMultiple(readArrayOfPermissionsList)
      .then(statuses => {
        console.log('statuses: ', statuses);
      })
      .catch(err => {
        console.log('err: ', err);
      });
    if (Platform.OS !== 'android') {
      await requestMultiple(readArrayOfPermissionsList)
        .then(async statuses => {
          console.log('request statuses: ', statuses);
        })
        .catch(err => {
          console.log('err: ', err);
        });
    } else {
      try {
        await PermissionsAndroid.requestMultiple([
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.ACCESS_COARSE_LOCATION',
          // 'android.permission.READ_CONTACTS',
          // 'android.permission.GET_ACCOUNTS',
          // 'android.permission.READ_SMS',
          // 'android.permission.SEND_SMS',
          // 'android.permission.RECEIVE_SMS',
          // 'android.permission.READ_CALL_LOG',
          // 'android.permission.WRITE_CALL_LOG',
          'android.permission.READ_PHONE_STATE',
          // 'android.permission.WRITE_CONTACTS',
          'android.permission.CALL_PHONE',
        ]).then(() => {});
        // (async (response) => {
        // if (response?.['android.permission.READ_CALL_LOG'] === 'granted') {
        // CallLogs.loadAll().then((callLogs) => {
        // setLogs(callLogs);
        // });
        // }
        // });
        Promise.resolve();
      } catch (error) {
        Promise.reject(error);
      }
    }

    if (Platform.OS === 'ios') {
      await Geolocation.requestAuthorization('always');
    } else {
      // if (AutoStart.isCustomAndroid()) {
      // AutoStart.startAutostartSettings();
      // }
    }

    // ApplicationAnalytics(
    //   {
    //     type:'CTA',
    //     eventKey: 'permissionsDisclaimer',
    //     parameters: { name: 'acceptAllPermissions' },
    //   },
    //   stores,
    // );
    const progress = {
      name: 'referralScreen',
      params: {},
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate('referralScreen');
  };

  const rejectPermissions = async () => {
    // ApplicationAnalytics(
    //   {
    //     type:'CTA',
    //     eventKey: 'permissionsDisclaimer',
    //     parameters: { name: 'rejectAllPermissions' },
    //   },
    //   stores,
    // );

    const progress = {
      name: 'referralScreen',
      params: {},
    };
    await saveInstantApprovalProgress(progress);
    // Navigate to Next Screen
    navigation.navigate('referralScreen');
  };

  return (
    <>
      <ScrollContainerWithNavHeader shapeVariant="tangelo">
        <ContinueLater fromScreen="permissionsDisclaimer" />
        <PageTitle title={translate('REQUEST_PERMISSIONS')} />

        <Typography
          customStyles={() => ({
            text: selectStyle('PermissionsDisclaimerDescription'),
          })}>
          {translate('ENSURE_HIGHER_CREDIT_LIMIT')}
        </Typography>

        {renderPermissionsList()}
        <View
          style={{
            marginTop: 10,
            marginBottom: 40,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View>
      </ScrollContainerWithNavHeader>
      <BottomContainer>
        <DefaultButton
          onPress={acceptPermissions}
          title={translate('ACCEPT_ALL_AND_CONTINUE')}
        />
        <DefaultButton
          mt={20}
          variant="secondaryBackground"
          onPress={rejectPermissions}
          title={translate('REJECT_ALL_AND_CONTINUE')}
        />

        {/* <DefaultButton
            mt={20}

            variant="secondaryBackground"
            onPress={() => navigation.goBack()}
            title={translate('GO_BACK')}
          /> */}
      </BottomContainer>
    </>
  );
};

export const PermissionsDisclaimer = baseScreen(permissionsDisclaimer, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
