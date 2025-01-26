import {View, ScrollView, TouchableOpacity, Platform} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {Assets} from 'assets';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavUserImage from '../NavUserImage';
import {
  checkBiometric,
  handleReturnUserName,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {SvgProps} from 'react-native-svg';
import {observer} from 'mobx-react';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import CodePush from 'react-native-code-push';
import deviceInfoModule from 'react-native-device-info';
import ReactMoE from 'react-native-moengage';
import DefaultButton from '../DefaultButton';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultSeparator from '../DefaultSeparator';
import NotificationBadge from '../NotificationBadge';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SectionsDataInterface {
  id: number;
  en: string;
  ar: string;
  icon: FC<SvgProps>;
  notificationBadge?: boolean;
  friendLink?: boolean;
  screenName: string;
  closeModal?: () => void;
  onPress?: () => void;
  auth?: boolean;
  fill?: string;
}

const UserProfileModal: React.FC<any> = props => {
  const {closeModal} = props;
  const stores = useStores();

  const userRole = stores.backend.users.userRole !== 'GUEST';

  const user = stores.backend.users.userData;

  const [version, setVersion] = useState<string>('test');

  const [biometricType, setBiometricType] = useState<string>('touch');

  const {translate} = useLocalization();

  const {TotalPoints} = stores.backend.wallet.userWallet.data;

  const getAppVersion = async () => {
    const [update] = await Promise.all([CodePush.getUpdateMetadata()]);
    if (update?.label) {
      const label = update.label.substring(1);
      setVersion(`v${update.appVersion} (${label})`);
    } else {
      const deviceVersion = deviceInfoModule.getVersion();
      setVersion(`${deviceVersion}`);
    }
  };

  const {
    backend: {
      users: {},
    },
  } = stores;

  const {
    theme: {
      palette: {
        common: {darkBlue},
      },
    },
  } = useTheme();

  const navigation = useNavigationUtils();

  const {selectStyle} = useStyles(styles);

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  useEffect(() => {
    getAppVersion();

    checkBiometric().then(res => setBiometricType(res.type));
  }, []);

  const userSectionsData: SectionsDataInterface[] = [
    {
      id: 1,
      en: translate('PERSONAL_DATA'),
      ar: translate('PERSONAL_DATA'),
      icon: creditech.User,
      screenName: 'userData',
      auth: true,
    },
    {
      id: 2,
      en: translate('NOTIFICATIONS'),
      ar: translate('NOTIFICATIONS'),
      icon: creditech.Notifications,
      screenName: 'notificationsCenter',
      auth: true,
      notificationBadge: true,
    },
    {
      id: 3,
      en: translate('FATORTY_FROM_BRANCH'),
      ar: translate('FATORTY_FROM_BRANCH'),
      icon: creditech.FatortyIcon,
      screenName: 'fatorty',
      auth: true,
    },
    {
      id: 4,
      en: translate('REQUESTS'),
      ar: translate('REQUESTS'),
      icon: creditech.Requests,
      screenName: 'tracking',
      auth: true,
    },
    {
      id: 5,
      en: translate('MANAGE_MY_INSTALLMENTS'),
      ar: translate('MANAGE_MY_INSTALLMENTS'),
      icon: creditech.ContractIcon,
      screenName: 'manageMyInstallments',
      fill: 'transparent',
      auth: true,
    },
    {
      id: 6,
      en:
        biometricType === 'face'
          ? translate('FACE_ID')
          : translate('FINGER_PRINT'),
      ar:
        biometricType === 'face'
          ? translate('FACE_ID')
          : translate('FINGER_PRINT'),
      icon: biometricType === 'face' ? creditech.FaceId : creditech.FingerPrint,
      screenName: 'biometricDevicesList',
      auth: true,
    },
  ];

  const bottomSection = [
    {
      id: 7,
      en: translate('SETTINGS'),
      ar: translate('SETTINGS'),
      icon: creditech.Settings,
      screenName: 'settings',
    },
    {
      id: 8,
      en: translate('CONTACT_US'),
      ar: translate('CONTACT_US'),
      icon: creditech.CustomerSupport,
      screenName: 'customerSupport',
    },
  ];

  const onNavigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
    closeModal();
  };

  const onNavigateToLoyalPoints = async () => {
    // ApplicationAnalytics({ eventKey: 'controlCenter_loyalPoints' }, stores);
    closeModal();
    navigation.navigate('loyalPoints');
  };

  const renderHeader = () => {
    const points = TotalPoints ?? 0;

    return (
      <View style={selectStyle('headerContainer')}>
        <RowView>
          <NavUserImage
            hideBadge
            onPress={closeModal}
            imageSVGDimensions={62}
          />
          <Typography marginTop={10} marginLeft={10} fontWeight={'700'}>
            {handleReturnUserName(user)}
          </Typography>
        </RowView>

        <DefaultButton
          width={260}
          mt={23}
          buttonStyle={{alignSelf: 'flex-start'}}
          onPress={onNavigateToLoyalPoints}
          icon={() => (
            <SvgView
              svgFile={creditech.walletMoney}
              width={wp(24)}
              height={hp(24)}
              me={2}
              stroke={'#FFF'}
              strokeWidth={0}
            />
          )}
          title={`${translate('YOUR_REWARDS')}`}
        />
      </View>
    );
  };

  const RenderRow = (rowData: SectionsDataInterface) => {
    const {
      en,
      ar,
      icon,
      notificationBadge,
      screenName,
      auth,
      fill,
      onPress,
      id,
    } = rowData;
    const {controlLoginModalView} = stores.backend.users;
    const handlePress = () => {
      if (onPress) {
        onPress();
      } else if (auth) {
        closeModal();
        !user?.id
          ? setTimeout(() => {
              props.onModalHide(() =>
                controlLoginModalView(true, () =>
                  onNavigateToScreen(screenName),
                ),
              );
            }, 500)
          : onNavigateToScreen(screenName);
      } else {
        onNavigateToScreen(screenName);
      }
    };
    return (
      <TouchableOpacity
        key={id}
        onPress={() => handlePress()}
        activeOpacity={0.75}
        style={selectStyle('rowStyle')}>
        <View style={selectStyle('IconNameContainer')}>
          <SvgView
            svgFile={icon}
            width={20}
            height={20}
            fill={fill ?? darkBlue}
          />
          <Typography
            customStyles={() => ({
              text: selectStyle('sectionText'),
            })}>
            {tempTranslate(en, ar)}
          </Typography>
        </View>
        {notificationBadge && <NotificationBadge />}
      </TouchableOpacity>
    );
  };

  const renderSections = () => {
    return userSectionsData?.map(item => {
      return RenderRow(item);
    });
  };

  const onLogout = async () => {
    closeModal();
    ReactMoE.logout();
    await AsyncStorage.removeItem('dynamicLink');
    stores.backend.auth.logout();
    navigation.resetTo({
      name: 'onboarding',
    });
  };

  const onLogIn = () => {
    closeModal();
    navigation.resetTo({
      name: 'onboarding',
    });
  };

  const logoutData = {
    id: 20,
    en: translate('LOG_OUT'),
    ar: translate('LOG_OUT'),
    icon: creditech.Logout,
    screenName: 'userData',
    onPress: () => onLogout(),
    fill: 'transparent',
  };
  const renderLogout = () => {
    return RenderRow(logoutData);
  };

  const renderLogin = () => {
    const loginData = {
      id: 66,
      en: translate('LOGIN'),
      ar: translate('LOGIN'),
      icon: creditech.Logout,
      screenName: 'userData',
      onPress: () => onLogIn(),
      fill: 'transparent',
    };
    return RenderRow(loginData);
  };

  const renderBottomSection = () => {
    return bottomSection?.map(item => {
      return RenderRow(item);
    });
  };

  return (
    <SafeAreaView style={selectStyle('safeAreContainer')}>
      <View style={selectStyle('container')}>
        {renderHeader()}
        <DefaultSeparator mt={37} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(40)}}>
          {renderSections()}
          <DefaultSeparator mt={37} mb={10} />
          {renderBottomSection()}
          <DefaultSeparator mt={37} mb={10} />
          <RowView jc="space-between" ai="center">
            {userRole ? renderLogout() : renderLogin()}
            <Typography marginTop={20} marginEnd={20}>
              {version}
            </Typography>
          </RowView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default observer(UserProfileModal);
