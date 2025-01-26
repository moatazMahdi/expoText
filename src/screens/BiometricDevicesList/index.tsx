import React, {useEffect, useState} from 'react';
import {Alert, Pressable, Switch, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import AlertModal from 'src/components/AlertModal';
import {useLocalization, useStores} from 'hooks';
import SvgView from 'src/components/SvgView';
import {
  checkBiometric,
  clearBiometric,
  createBiometricKey,
} from 'src/utils/HelpersFunctions';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const biometricDevicesList: React.FC = () => {
  const [biometricAlertData, setBiometricAlertData] = useState<
    {serialNumber: string; model: string} | boolean
  >(false);
  const [biometricAlert, setBiometricAlert] = useState<boolean>(false);
  const [biometricType, setBiometricType] = useState<'touch' | 'face'>('touch');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [biometricDevices, setBiometricDevices] = useState<{}[]>([]);
  const [biometricDevicesLoading, setBiometricDevicesLoading] =
    useState<boolean>(false);
  const [userStoredPhone, setUserStoredPhone] = useState<string>('');
  const [biometricOnDevice, setBiometricOnDevice] = useState<boolean>(false);

  const {translate} = useLocalization();
  const {selectStyle} = useStyles(styles);
  const stores = useStores();

  const phoneNumber = stores.backend.users.userData?.phone;
  const rnBiometrics = new ReactNativeBiometrics();

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

  const checkUserBiometrics = async () => {
    const userPhone = await AsyncStorage.getItem('hasBiometric');

    if (userPhone) {
      setIsLoading(true);
      rnBiometrics.biometricKeysExist().then(async resultObject => {
        const {keysExist} = resultObject;

        if (keysExist) {
          const checkPrivate =
            await stores.backend.auth.CheckBiometricPrivateKey(
              userPhone?.slice(2),
            );
          if (checkPrivate?.hasBiometric) {
            setUserStoredPhone(userPhone);
            setIsLoading(false);
          } else {
            stores.backend.auth.DeleteBiometricPrivateKey(userPhone?.slice(2));
            clearBiometric();
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  };

  const getDevices = async () => {
    setBiometricDevicesLoading(true);

    try {
      const devices = await stores.backend.auth.GetBiometricDevices();
      if (devices.fingerPrints) {
        setBiometricDevices(devices.fingerPrints);
      }
    } catch (err) {
    } finally {
      setBiometricDevicesLoading(false);
    }
  };

  useEffect(() => {
    checkBiometric().then(res => {
      setBiometricOnDevice(res.available);
      setBiometricType(res.type);
      checkUserBiometrics();
    });

    getDevices();
  }, []);

  const onActivateBiometric = async () => {
    setIsLoading(true);
    if (phoneNumber) {
      rnBiometrics
        .simplePrompt({promptMessage: translate('CONFIRM_FINGERPRINT')})
        .then(resultObject => {
          const {success} = resultObject;

          if (success) {
            createBiometricKey(
              translate,
              'Biometric_devices',
              phoneNumber,
              stores,
              setIsLoading,
              null,
              setUserStoredPhone,
            );
          } else {
            setIsLoading(false);
            return false;
          }
        })
        .catch(() => {
          Alert.alert('', translate('EXCEEDED_NUMBER_OF_ATTEMPTS'), [
            {text: translate('GENERIC_CONFIRM')},
          ]);
          setIsLoading(false);
          return false;
        });
    }
  };

  const onCloseBiometric = () => {
    setBiometricAlert(false);
  };

  const onShowModal = item => {
    setBiometricAlert(true);
    setBiometricAlertData(item);
  };

  const onDeleteBioMetric = async () => {
    setIsLoading(true);
    setBiometricAlert(false);
    try {
      await stores.backend.auth.DeleteBiometricPrivateKey(
        phoneNumber?.slice(2),
        biometricAlertData?.serialNumber,
      );
      getDevices();
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSwitchValueChange = async value => {
    if (value) {
      onActivateBiometric();
    } else {
      setIsLoading(true);
      clearBiometric();
      stores.backend.auth.DeleteBiometricPrivateKey(phoneNumber?.slice(2));
      setUserStoredPhone('');
      setIsLoading(false);
    }
  };

  const renderDevices = ({item}) => {
    return (
      <DropShadowWrapper style={selectStyle('itemContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('fontStyle'),
          })}>
          {item?.model === '' ? translate('UNKNOWN_DEVICE') : item?.model}
        </Typography>

        <Pressable
          onPress={() => onShowModal(item)}
          hitSlop={{bottom: 10, top: 10, left: 10, right: 10}}>
          <SvgView
            svgFile={creditech.Trash}
            width={20}
            height={20}
            stroke={'red'}
          />
        </Pressable>
      </DropShadowWrapper>
    );
  };

  const renderBiometricActivation = () => {
    return (
      <View
        style={[
          selectStyle('biometricContainer'),
          biometricDevices?.length === 0 && {marginBottom: hp(40)},
        ]}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <SvgView
            svgFile={
              biometricType === 'touch'
                ? creditech.FingerPrint
                : creditech.FaceId
            }
            fill={common.darkBlue}
            width={20}
            height={20}
          />

          <Typography
            customStyles={() => ({
              text: selectStyle('fontStyleFinger'),
            })}>
            {biometricType === 'face'
              ? translate('FACE_ID_ACTIVATION')
              : translate('FINGER_PRINT_ACTIVATION')}
          </Typography>
        </View>

        <Switch
          disabled={!biometricOnDevice}
          value={!!userStoredPhone}
          onValueChange={onSwitchValueChange}
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={selectStyle('containerStyle')}>
        {renderBiometricActivation()}
        <DefaultFlatList
          style={{paddingHorizontal: wp(20)}}
          emptyString={
            biometricDevicesLoading ? null : translate('NO_OTHER_DEVICES_FOUND')
          }
          flatListProps={{
            data: biometricDevices,
            renderItem: renderDevices,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        view
        title={
          biometricType === 'touch'
            ? translate('FINGER_PRINT')
            : translate('FACE_ID')
        }>
        {renderContent()}

        <AlertModal
          loading={false}
          titleText={translate('DELETE')}
          bodyText={`${translate('DELETE_FINGER_PRINT_PROMPT')} ${
            biometricAlertData?.model
          }`}
          alertVisible={biometricAlert}
          closeAlert={onCloseBiometric}
          onConfirm={onDeleteBioMetric}
        />
      </ScrollContainerWithNavHeader>

      {isLoading || biometricDevicesLoading ? <DefaultOverLayLoading /> : null}
    </View>
  );
};

export const BiometricDevicesList = baseScreen(biometricDevicesList, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
