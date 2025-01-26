import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Pressable,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactMoE, {MoEGeoLocation} from 'react-native-moengage';
import {firebase} from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import {FirebaseNotifications} from 'rnfn';
import {
  HmsPushEvent,
  HmsPushInstanceId,
  HmsPushMessaging,
} from '@hmscore/react-native-hms-push';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import ImageWithShadow from 'src/components/ImageWithShadowCN';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import HomeCreditView from 'src/components/HomeCreditViewCN';
import HomeVoucherCard from 'src/components/HomeVoucherCard';
import HomeNavHeader from 'src/components/HomeNavHeaderCN';
import ArticlesCard from 'src/components/ArticlesCard';
import {HomeMerchants} from 'src/utils/Constants';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import ViewAll from 'src/components/ViewAll';
import {
  getAllBanners,
  handleDynamicLink,
  hasHuaweiMobileServices,
  mixOffersData,
  mixServicesData,
  SendMoEngageNotifications,
  shuffleArray,
} from 'src/utils/HelpersFunctions';
import {LoadingState} from 'utils';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';
import HomeBanners from 'src/components/HomeBanners';
import OurServicesSVGCard from 'src/components/OurServicesSVGCard';

const newHomeScreen: React.FC = () => {
  const route = useRoute() || {};

  const [refreshing, setRefreshing] = useState(false);
  const [programsProducts, setProgramsProducts] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [version, setVersion] = useState('');
  const [offers, setOffers] = useState([]);
  const [programsProductsLoading, setProgramsProductsLoading] = useState(false);
  // const [articlesLoading, setProgramsProductsLoading] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const {userId} = stores.backend.auth;
  const userData = stores?.backend?.users?.userData;
  const {data: programsData} = stores.backend.programs.programs;
  const {data: generalOffer} = stores.backend.wallet.generalVouchers;
  const generalMerchantOffers =
    stores.backend.wallet.generalMerchantOffers.data;
  const {data: productsData} = stores.backend.products.products;
  const dynamicLinkUrl = stores.backend.users.dynamicLinkUrl;
  const articles = stores.backend.programs.articles.data;
  const productMerchantsLoading =
    stores.backend.products.productMerchants.loadingState ===
    LoadingState.SUCCEEDED;
  const articlesLoading =
    stores.backend.programs.articles.loadingState == LoadingState.LOADING;
  const latestOffersLoading =
    stores.backend.wallet.generalMerchantOffers.loadingState ===
    LoadingState.LOADING;

  const {
    images: {
      screens: {creditech, home},
    },
  } = Assets;

  const {
    theme: {
      palette: {common, primary},
    },
  } = useTheme();

  const trackUserDataForMoEngage = async () => {
    if (userId) {
      const {name, email, phone} = userData;
      ReactMoE.setUserName(name || '');
      ReactMoE.setUserEmailID(email || '');
      ReactMoE.setUserContactNumber(phone || '');
      await SendMoEngageNotifications(stores);
    }
  };

  const getUserCredits = async () => {
    await stores.backend.users.userCredits.updateOptions({
      userId,
    });
  };

  const getActiveContracts = async () => {
    await stores.backend.users.userActiveContracts.updateOptions({
      nationalId: userData?.nationalId,
    });
  };

  const getAppVersion = async () => {
    if (__DEV__) return;
    const [update] = await Promise.all([codePush.getUpdateMetadata()]);
    if (update?.label) {
      const label = update.label.substring(1);
      setVersion(`${update.appVersion} (${label})`);
    } else {
      const deviceVersion = DeviceInfo.getVersion();
      setVersion(`${deviceVersion}`);
    }
  };

  const _location = () => {
    Geolocation.getCurrentPosition(
      location => {
        const {latitude, longitude} = location.coords;
        setLatitude(`${latitude}`);
        setLongitude(`${longitude}`);
      },
      err => {},
      {timeout: 20000, enableHighAccuracy: true, maximumAge: 1000},
    );
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ])
        .then(granted => {
          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] == 'granted' &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] == 'granted'
          ) {
            _location();
          } else {
          }
        })
        .catch(err => {
          console.log('error: ', err);
        });
    } else {
      const result = await Geolocation.requestAuthorization('always');
      if (result === 'granted') {
        _location();
      }
    }
  };

  useEffect(() => {
    // MoEngage Tracking
    //ReactMoE.showInApp();
    const initScreen = async () => {
      stores.backend.products.merchantsCategories.updateOptions({});
      stores.backend.programs.programs.fetch();
      stores.backend.products.products.fetch();
      stores.backend.programs.articles.fetch();
      stores.backend.wallet.generalMerchantOffers.updateOptions({
        productId: '6',
        merchantId: '0',
      });
      if (userId) {
        trackUserDataForMoEngage();
        if (userData?.nationalId) {
          getUserCredits();
          getActiveContracts();
        }

        if (stores.backend.auth.getAccessToken()) {
          if (Platform.OS === 'ios') {
            await firebase.messaging().registerDeviceForRemoteMessages();
            const fcmToken = await firebase.messaging().getToken();
            ReactMoE.passFcmPushToken(fcmToken);
            stores.backend.users.updateFCMToken(stores.backend.auth.userId, {
              firebaseNotificationToken: fcmToken,
            });
          } else {
            hasHuaweiMobileServices().then(res => {
              res
                ? HmsPushInstanceId.getToken('')
                    .then(result => {
                      ReactMoE.passPushKitPushToken(result?.result);
                      stores.backend.users.updateFCMToken(
                        stores.backend.auth.userId,
                        {
                          firebaseNotificationToken: result?.result,
                        },
                      );
                    })
                    .catch(err => {
                      console.log(
                        '[getToken] Error/Exception: ' + JSON.stringify(err),
                      );
                    })
                : FirebaseNotifications.getToken().then(fcm_token => {
                    ReactMoE.passFcmPushToken(fcm_token);

                    stores.backend.users.updateFCMToken(
                      stores.backend.auth.userId,
                      {
                        firebaseNotificationToken: fcm_token,
                      },
                    );
                  });
            });
          }
        }
        try {
          stores.backend.wallet.userWallet.fetch(userId.toString());
        } catch (error) {}
        try {
          stores.backend.users.userContracts.updateOptions({
            userId,
          });
        } catch (error) {}
        Promise.all([getAppVersion(), getCurrentLocation()]);
      }
    };

    initScreen();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerData = await stores.backend.general.getGeneralBanners();
        const sortedBanners = bannerData.sort((a, b) => a.order - b.order);
        setBanners(sortedBanners);
      } catch (err) {
        console.error('Error fetching banners: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const checkHmsNotificationsLink = () => {
      hasHuaweiMobileServices().then(res => {
        if (res) {
          HmsPushEvent.onNotificationOpenedApp(res => {
            handleDynamicLink(
              {hmsData: res?.extras},
              stores,
              translate,
              navigation,
            );
          });
          HmsPushMessaging.getInitialNotification().then(res => {
            handleDynamicLink(
              {hmsData: res?.result?.extras},
              stores,
              translate,
              navigation,
            );
          });
        }
      });
    };
    checkHmsNotificationsLink();
  }, []);

  useEffect(() => {
    if (dynamicLinkUrl) {
      handleDynamicLink({link: dynamicLinkUrl}, stores, translate, navigation);
    }
  }, [dynamicLinkUrl]);

  useEffect(() => {
    if (latitude && longitude) {
      stores.backend.users.updateUserData(stores.backend.auth.userId, {
        location: {latitude, longitude},
      });
      ReactMoE.setUserLocation(new MoEGeoLocation(+latitude, +longitude));
    }
  }, [latitude, longitude]);

  const sendDeviceInfo = async () => {
    const platform = Platform.OS;
    const is_tablet = DeviceInfo.isTablet();
    const system_version = DeviceInfo.getSystemVersion();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const power_state = await DeviceInfo.getPowerState();
    const manufacturer = await DeviceInfo.getManufacturer();
    const carrier = await DeviceInfo.getCarrier();
    const total_capacity = +(
      (await DeviceInfo.getTotalDiskCapacity()) /
      (1024 * 1024 * 1024)
    ).toFixed(2);
    const free_storage = +(
      (await DeviceInfo.getFreeDiskStorage()) /
      (1024 * 1024 * 1024)
    ).toFixed(2);
    stores.backend.users.updateUserData(stores.backend.auth.userId, {
      appVersion: version,
      extraInfo: {
        platform,
        is_tablet,
        system_version,
        brand,
        model,
        power_state,
        manufacturer,
        carrier,
        total_capacity,
        free_storage,
      },
    });
  };

  useEffect(() => {
    async function getDynamicLink() {
      const dynamicLinkKey = await AsyncStorage.getItem('dynamicLinkKey');
      const dynamicLinkValue = await AsyncStorage.getItem('dynamicLinkValue');
      handleDynamicLink(
        {
          customDynamicLink: {
            key: dynamicLinkKey,
            value: dynamicLinkValue,
          },
        },
        stores,
        translate,
        navigation,
      );
    }

    getDynamicLink();

    return () => {
      AsyncStorage.removeItem('dynamicLinkKey');
      AsyncStorage.removeItem('dynamicLinkValue');
    };
  }, []);

  useEffect(() => {
    if (version) sendDeviceInfo();
  }, [version]);

  useEffect(() => {
    setProgramsProductsLoading(true);
    if (productsData || programsData)
      mixServicesData(
        programsData,
        productsData,
        translate,
        setProgramsProducts,
      );
    setProgramsProductsLoading(false);
  }, [productsData, programsData]);

  useFocusEffect(
    useCallback(() => {
      stores.backend.general.branches.fetch();
    }, [stores]),
  );

  useEffect(() => {
    if (generalMerchantOffers?.length || generalOffer?.length)
      mixOffersData(generalMerchantOffers, [], setOffers);
  }, [generalMerchantOffers]);

  const refresh = async () => {
    setRefreshing(true);
    stores.backend.instantApproval.validateNationalIdExistence(
      userData?.nationalId || '22222222222222',
      userData?.phone,
    );
    stores.backend.programs.programs.fetch();
    stores.backend.products.products.fetch();
    stores.backend.programs.articles.fetch();
    stores.backend.wallet.userWallet.fetch(userId.toString());
    stores.backend.users.userContracts.updateOptions({
      userId,
    });
    stores.backend.wallet.generalMerchantOffers.updateOptions({
      productId: '6',
      merchantId: '0',
    });
    if (userData?.nationalId) {
      getUserCredits();
    }

    setRefreshing(false);
  };

  const onNavigateToLoyalPoints = async () => {
    ApplicationAnalytics(
      {
        eventKey: 'home_loyalPoints',
        type: 'CTA',
        parameters: {ScreenName: route?.name},
      },
      stores,
    );

    navigation.navigate('loyalPoints');
  };

  const onNavigateLatestOffers = async () => {
    ApplicationAnalytics({eventKey: 'home_latestOffers', type: 'CTA'}, stores);
    navigation.navigate('latestOffers', {data: offers});
  };

  const onNavigateShopFromMerchants = async () => {
    ApplicationAnalytics(
      {eventKey: 'home_shopFromMerchants', type: 'CTA'},
      stores,
    );
    navigation.navigate('shopFromMerchants');
  };

  const onNavigateOurServices = async () => {
    // const x = [...programsProducts, ...articlesWithoutFAtorty]
    ApplicationAnalytics({eventKey: 'home_ourServices', type: 'CTA'}, stores);
    programsProductsLoading
      ? null
      : navigation.navigate('ourServices', {
          data: [...programsProducts, ...articlesWithoutFAtorty],
        });
  };
  const removeFirstElement = array => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    return array.slice(1);
  };

  const articlesWithoutFAtorty = articles;

  const navigateToScreenWithParams = async (screenName, params, item) => {
    item?.title &&
      ApplicationAnalytics(
        {
          eventKey: item?.title,
          type: 'CTA',
          parameters: {ScreenName: screenName},
        },
        stores,
      );
    navigation.navigate(screenName, params);
  };

  const RewardsAndGift = () => {
    const today = new Date();
    const startOfNovember = new Date(today.getFullYear(), 10, 1);
    const endOfNovember = new Date(today.getFullYear(), 10, 30);
    const isNovember = today >= startOfNovember && today <= endOfNovember;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: wp(20),
          justifyContent: 'space-between',
          // backgroundColor:"red"
        }}>
        <Pressable
          onPress={onNavigateToLoyalPoints}
          style={[selectStyle('loyaltyContainer')]}>
          <SvgView
            svgFile={creditech.walletMoney}
            width={wp(24)}
            height={hp(24)}
          />

          <Typography
            customStyles={() => ({
              text: selectStyle('loyaltyText2'),
            })}>
            {`${translate('YOUR_REWARDS')}`}
          </Typography>
        </Pressable>
        {/* {isNovember && ( */}
        {/* <Pressable
            onPress={() => navigation.navigate('blueNovember')}
            style={selectStyle('loyaltyContainer')}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                // backgroundColor: 'rgba(0, 0, 0, 0.40)',
                // borderRadius: 40,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 24, height: 24}}
                source={creditech.GiftIcon1}
              />
              <Typography
                customStyles={() => ({
                  text: selectStyle('blueNovember'),
                })}>
                {translate('BLUE_NOVEMBER')}
              </Typography>
            </View>
          </Pressable> */}
        {/* )} */}
      </View>
    );
  };
  return (
    <ScrollContainerWithNavHeader
      bounces
      hideHeader
      scrollViewStyle={selectStyle('contentContainer')}
      refreshControl={
        <RefreshControl
          tintColor={primary.value}
          colors={[primary.value]}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }>
      <View style={{backgroundColor: common.backGroundColor, flex: 1}}>
        <ImageBackground
          resizeMode="cover"
          source={creditech.homeHeaderBackGround}
          style={selectStyle('contentWrapper')}
          imageStyle={selectStyle('imageWrapperStyle')}>
          <HomeNavHeader />

          {/* <Pressable
            onPress={onNavigateToLoyalPoints}
            style={selectStyle('loyaltyContainer')}>
            <SvgView
              svgFile={creditech.walletMoney}
              width={wp(24)}
              height={hp(24)}
            />

            <Typography
              customStyles={() => ({
                text: selectStyle('loyaltyText2'),
              })}>
              {`${translate('YOUR_REWARDS')}`}
            </Typography>
          </Pressable> */}
          <RewardsAndGift />
          <HomeCreditView />
        </ImageBackground>

        {banners ? (
          <ViewAll
            horizontal={true}
            onPress={() => {}}
            loading={loading}
            data={banners}
            renderItems={({item}) => (
              <HomeBanners
                item={item}
                style={{borderRadius: 16}}
                offerData={offers ? offers : []}
              />
            )}
            hideViewAll
            maxNumberOfItemsToRender={4}
          />
        ) : null}

        <ViewAll
          title={translate('LATEST_OFFERS')}
          horizontal={true}
          onPress={onNavigateLatestOffers}
          data={offers}
          renderItems={({item}) => {
            let newItem;
            if (!item?.hasOwnProperty('Image')) {
              newItem = {
                title: item.title,
                image: item.imageUrl || item.image,
                Description: item.description,
                ...item,
              };
            } else {
              newItem = {title: item.Title, image: item.Image, ...item};
            }
            return (
              <HomeVoucherCard
                onPress={() =>
                  navigateToScreenWithParams(
                    'offerDetails',
                    {offer: newItem},
                    newItem,
                  )
                }
                item={newItem}
                isSmall
              />
            );
          }}
          loading={latestOffersLoading}
          emptyComponent={() =>
            !latestOffersLoading ? (
              <View style={{marginVertical: hp(20)}}>
                <Typography colorHex={common.grey} textAlign="center">
                  {translate('NO_OFFERS')}
                </Typography>
              </View>
            ) : (
              <ActivityIndicator size={'large'} color={common.darkBlue} />
            )
          }
          hideViewAll={offers && offers?.length <= 2}
          maxNumberOfItemsToRender={6}
        />

        <ViewAll
          horizontal={true}
          onPress={() => {}}
          data={getAllBanners(navigation, offers, stores, 'digitalFatorty')}
          renderItems={({item}) => (
            <HomeBanners fatorty item={item} style={{borderRadius: 16}} />
          )}
          hideViewAll
        />

        <ViewAll
          title={translate('SHOP_FROM_MERCHANTS')}
          horizontal={true}
          onPress={onNavigateShopFromMerchants}
          data={shuffleArray() ?? []}
          renderItems={({item}) => (
            <HomeVoucherCard
              onPress={async () => {
                try {
                  navigateToScreenWithParams(
                    'merchantDetails',
                    {merchant: {id: item?.id}, getData: true},
                    {id: item?.id},
                  );
                } catch (e) {
                  console.log('error', e.message);
                }
              }}
              bookingAuth
              item={{
                ...item,
                title: item.title,
                image: item.imageUrl,
              }}
            />

            // <ImageWithShadow
            //   w={140}
            //   h={140}
            //   onPress={async () => {
            //     try {
            //       navigateToScreenWithParams(
            //         'merchantDetails',
            //         {merchant: {id: item?.id}, getData: true},
            //         {id: item?.id},
            //       );
            //     } catch (e) {
            //       console.log('error', e.message);
            //     }
            //   }}
            //   mt={1}
            //   item={{
            //     ...item,
            //     title: item.title,
            //     image: item.imageUrl,
            //   }}
            // />
          )}
          loading={productMerchantsLoading}
        />

        <ViewAll
          title={translate('OUR_SERVICES')}
          isOurServices={true}
          onPress={onNavigateOurServices}
          data={[...programsProducts, ...articlesWithoutFAtorty]}
          numColumns={4}
          isVertical
          maxNumberOfItemsToRender={8}
          renderItems={({item}) => {
            // console.log("item :: ", item)
            return (
              <OurServicesSVGCard
                cardStyle={{margin: 0, padding: 0}}
                item={item}
                svgImage={item?.cname}
                width={74}
                height={74}
              />
            );
          }}
          // <OurServicesCard item={item} />
        />
      </View>
    </ScrollContainerWithNavHeader>
  );
};

export const NewHomeScreen = baseScreen(newHomeScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
