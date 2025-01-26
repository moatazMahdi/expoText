import React, {useState, useEffect} from 'react';
import {useStores, useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ViewAll from 'src/components/ViewAll';
import {
  convertToHttps,
  getNearestLocation,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import BranchCard from 'src/components/BranchCard';
import ProgressiveImage from 'src/components/ProgressiveImage';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {LoadingState} from 'utils';
import Geolocation from 'react-native-geolocation-service';
import {
  Dimensions,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  View,
} from 'react-native';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {Assets} from 'assets';
import DefaultButton from 'src/components/DefaultButton';
import SvgView from 'src/components/SvgView';

interface MerchantDetailsInterface {
  image: string;
  title: string;
  id: number;

  branches: {
    address: string;
    phoneNumber: number;
    longitude: number;
    latitude: number;
    areaId: number;
  }[];
}

const merchantDetails: React.FC = () => {
  const stores = useStores();
  const {} = stores;

  const {
    images: {
      screens: {creditech, branches},
    },
  } = Assets;

  const navigation = useNavigationUtils();

  const {merchant, isFromCashback, enName} = useRoute().params as {
    merchant: MerchantDetailsInterface;
    isFromCashback: boolean;
    enName: string;
  };

  const [merchantData, setMerchantData] = useState(merchant);

  const {translate} = useLocalization();

  const merchantOffers = stores.backend.wallet.merchantOffers.data;
  const merchantOffersLoading =
    stores.backend.wallet.merchantOffers.loadingState === LoadingState.LOADING;

  const [nearestBranch, setNearestBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [merchantDataById, setMerchantDataById] = useState(null);
  const {selectStyle} = useStyles(styles);

  useEffect(() => {
    merchant?.title &&
      ApplicationAnalytics(
        {
          eventKey: merchant?.title,
          type: 'CTA',
          parameters: {
            ScreenName: 'merchantDetails',
          },
        },
        stores,
      );
    stores.backend.wallet.merchantOffers._setData([]);
    stores.backend.wallet.merchantOffers.updateOptions({
      productId: '6',
      merchantId: merchant?.id + '',
    });
    const getMerchantData = async () => {
      try {
        setLoading(true);
        const merchant = await stores.backend.wallet.getMerchantByIdServer(
          merchantData?.id,
        );
        setMerchantDataById(merchant);
        if (!merchant?.hasOwnProperty('Image')) {
          setMerchantData({
            title: merchant.title,
            image: merchant.imageUrl,
            Description: merchant.description,
            ...merchant,
          });
          if (isFromCashback) {
            ApplicationAnalytics(
              {
                eventKey: `Offline_Store_Pressed_${enName}`,
                type: 'CTA',
              },
              stores,
            );
          }
          ApplicationAnalytics(
            {
              eventKey: merchant?.title,
              type: 'CTA',
              parameters: {
                ScreenName: 'merchantDetails',
              },
            },
            stores,
          );
        } else {
          setMerchantData({
            title: merchant.Title,
            image: merchant.Image,
            ...merchant,
          });
          ApplicationAnalytics(
            {
              eventKey: merchant?.title,
              type: 'CTA',
              parameters: {
                ScreenName: 'merchantDetails',
              },
            },
            stores,
          );
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    getMerchantData();
  }, []);

  useEffect(() => {
    async function handleRecentlyViewCreate() {
      if (merchantData?.title) {
        try {
          setLoading(true);
          const type = 'merchant';
          const imageUrl =
            merchantData?.image || 'http://example.com/detail-image.jpg';
          const name = merchantData?.title;
          const code = merchantData?.id + '';
          const expiryDate = merchantData?.expiryDate;
          const details = {
            id: merchantData?.id + '',
            name: merchantData?.title,
            image: merchantData?.image || 'http://example.com/detail-image.jpg',
          };

          await stores.backend.bookingAuth.recentlyViewCreate(
            type,
            imageUrl,
            name,
            code,
            expiryDate,
            details,
          );
        } catch (error) {
          console.error('Error in recentlyViewCreate:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (
      merchantDataById?.isDigitalAuth === 'true' ||
      merchantData?.isDigitalAuth === 'true'
    ) {
      handleRecentlyViewCreate();
    }
  }, [merchantData?.title]);

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const ImageUrlHttps = convertToHttps(merchantData?.image);

  const MerchantImage = () => {
    return (
      <View style={selectStyle('headerImageContainer')}>
        {merchantData?.image ? (
          <ProgressiveImage
            resizeMode="contain"
            imageSource={{uri: ImageUrlHttps}}
            imageStyle={selectStyle('headerImage')}
          />
        ) : (
          <ProgressiveImage
            resizeMode="contain"
            imageSource={creditech.merchantEmpty}
            imageStyle={selectStyle('headerImage')}
          />
        )}
        <Typography style={selectStyle('merchantTitle')}>
          {merchantData?.title}
        </Typography>
      </View>
    );
  };

  // const noIMAGE = () => {
  //   return (
  //     <View style={selectStyle('headerNoImage')}>
  //       <Typography textAlign="center" fontSize={22} fontWeight="900">
  //         {merchantData?.title}
  //       </Typography>
  //     </View>
  //   );
  // };

  const renderBranchLocations = ({item}) => {
    return (
      <View style={selectStyle('merchantMap')}>
        <BranchCard mapMerchants item={item} />
      </View>
    );
  };

  const _location = () => {
    Geolocation.getCurrentPosition(
      location => {
        const {latitude, longitude} = location.coords;
        const nearestBranch = getNearestLocation(merchantData?.branches, {
          latitude,
          longitude,
        });
        setNearestBranch(nearestBranch);
      },
      err => {
        console.log(err);
      },
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
            granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
          ) {
            _location();
          } else {
            console.log('Permission not granted');
          }
        })
        .catch(err => {
          console.log('error: ', err);
        });
    } else {
      const result = await Geolocation.requestAuthorization('always');
      if (result === 'granted') {
        _location();
      } else {
        //Linking.openURL('app-settings:');
      }
    }
  };

  useEffect(() => {
    Promise.all([getCurrentLocation()]);
    return () => {};
  }, []);

  const onNavigateBranches = () => {
    navigation.navigate('branches', {data: merchantData?.branches});
  };
  const MerchantBranches = () => {
    return (
      <View style={{marginBottom: hp(75)}}>
        <ViewAll
          title={translate('MERCHANT_BRANCHES')}
          data={
            nearestBranch && merchantData?.branches.length > 1
              ? [nearestBranch, ...merchantData?.branches]
              : merchantData?.branches
          }
          renderItems={renderBranchLocations}
          onPress={onNavigateBranches}
          loading={false}
          maxNumberOfItemsToRender={3}
          horizontal={true}
          containerStyle={{marginBottom: hp(-40)}}
          listStyle={{paddingHorizontal: 16}}
        />
      </View>
    );
  };

  const navigateToScreenWithParams = async (screenName, params, item) => {
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

  const onNavigateLatestOffers = async () => {
    ApplicationAnalytics({eventKey: 'latestOffers', type: 'CTA'}, stores);
    navigation.navigate('latestOffers', {data: merchantOffers});
  };

  const renderLatestOffersItems = ({item}) => {
    const newItem = {
      ...item,
      title: item.Title,
      image: item.Image,
      merchantOffer: true,
    };
    return (
      <Pressable
        style={selectStyle('merchantOfferContainer')}
        onPress={() =>
          navigateToScreenWithParams(
            'offerDetails',
            {offer: newItem, showFloating: true},
            newItem,
          )
        }>
        <Typography style={selectStyle('merchantOfferTitle')}>
          {item.Title}
        </Typography>
        <Typography style={selectStyle('merchantOfferDescription')}>
          {item.Description}
        </Typography>
      </Pressable>
      // <ImageWithShadow
      //   noImage
      //   mt={1}
      // onPress={() =>
      //   navigateToScreenWithParams(
      //     'offerDetails',
      //     { offer: newItem, showFloating: true },
      //     newItem,
      //   )
      // }
      //   item={newItem}
      // />
    );
  };

  const renderEmptyMerchants = () => {
    return (
      <View style={selectStyle('emptyTextContainer')}>
        <Typography colorHex={common.grey}>{translate('NO_OFFERS')}</Typography>
      </View>
    );
  };

  const ModelCard = ({svgFile, title, onPress}) => {
    return (
      <Pressable
        style={{
          width: '100%',
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 40,
          alignItems: 'center',
          marginBottom: 16,
        }}
        onPress={onPress}>
        <SvgView
          svgFile={svgFile}
          width={16}
          height={16}
          style={{
            marginRight: wp(6),
          }}
        />
        <Typography
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: 'black',
            lineHeight: 24,
          }}>
          {title}
        </Typography>
      </Pressable>
    );
  };

  const MyModal = ({visible, onClose}) => {
    const openUrl = url => {
      if (url) {
        Linking.openURL(url).catch(err =>
          console.error('Failed to open URL:', err),
        );
      }
    };

    return (
      <Modal transparent={true} visible={visible}>
        <Pressable
          style={selectStyle('modalOverlay')}
          onPress={() => setModalVisible(false)}>
          <View style={selectStyle('modalContent')}>
            {merchantData?.facebook ? (
              <ModelCard
                svgFile={branches.facebookMerchant}
                title={'Facebook'}
                onPress={() => openUrl(merchantData?.facebook)}
              />
            ) : null}
            {merchantData?.instagram ? (
              <ModelCard
                svgFile={branches.instagramMerchant}
                title={'instagram'}
                onPress={() => openUrl(merchantData?.instagram)}
              />
            ) : null}

            {Platform.OS === 'android' ? (
              <>
                {merchantData?.androidApp ? (
                  <ModelCard
                    svgFile={branches.googlePlay}
                    title={'App'}
                    onPress={() => openUrl(merchantData?.androidApp)}
                  />
                ) : null}
              </>
            ) : (
              <>
                {merchantData?.iosApp ? (
                  <ModelCard
                    svgFile={branches.appStore}
                    title={'App'}
                    onPress={() => openUrl(merchantData?.iosApp)}
                  />
                ) : null}
              </>
            )}
            {merchantData?.website ? (
              <ModelCard
                svgFile={branches.webSite}
                title={'Website '}
                onPress={() => openUrl(merchantData?.website)}
              />
            ) : null}

            {merchantData?.tiktok ? (
              <ModelCard
                svgFile={branches.tiktok}
                title={'Tiktok '}
                onPress={() => openUrl(merchantData?.tiktok)}
              />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    );
  };

  const renderMerchantOffers = () => {
    return (
      <ViewAll
        title={translate('GENERAL_OFFER_TITLE')}
        // emptyComponent={renderEmptyMerchants}
        data={merchantOffers}
        hideViewAll={merchantOffers.length <= 3}
        renderItems={renderLatestOffersItems}
        onPress={onNavigateLatestOffers}
        loading={merchantOffersLoading}
        maxNumberOfItemsToRender={3}
        horizontal={true}
        containerStyle={{alignItems: 'flex-start'}}
      />
    );
  };
  const disabled =
    !merchantData?.iosApp ||
    !merchantData?.tiktok ||
    !merchantData?.website ||
    !merchantData?.androidApp ||
    !merchantData?.instagram ||
    !merchantData?.facebook;

  return (
    <>
      <ScrollContainerWithNavHeader
        title={translate('SHOP_FROM_MERCHANTS')}
        shapeVariant="orange">
        <View style={{paddingHorizontal: 16}}>
          <MerchantImage />
          {/* {merchantData?.image ? <><MerchantImage/></> : noIMAGE()} */}
        </View>
        {renderMerchantOffers()}
        <MerchantBranches />
        <View
          style={{
            width: Dimensions.get('window').width - 25,
            position: 'absolute',
            bottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          {(merchantDataById?.isOnline === 'True' ||
          merchantDataById?.isOnline === 'true') &&
          !disabled ? (
            <DefaultButton
              title={tempTranslate('Online', 'موقع التاجرالإلكتروني')}
              // icon={branches.webSite}
              titleStyle={{marginStart: 8, fontSize: 16, fontWeight: '500'}}
              buttonStyle={{
                height: 48,
                borderRadius: 40,
                width:
                  merchantDataById?.isDigitalAuth === 'true'
                    ? Dimensions.get('window').width / 2 - 20
                    : Dimensions.get('window').width - 20,
              }}
              onPress={() => setModalVisible(true)}
            />
          ) : null}

          {merchantDataById?.isDigitalAuth === 'true' ? (
            <DefaultButton
              title={tempTranslate('Buy Now', 'اشتري الان')}
              titleStyle={{marginStart: 8, fontSize: 16, fontWeight: '500'}}
              buttonStyle={{
                height: 48,
                borderRadius: 40,
                width:
                  (merchantDataById?.isOnline === 'True' ||
                  merchantDataById?.isOnline === 'true') && !disabled
                    ? Dimensions.get('window').width / 2 - 20
                    : Dimensions.get('window').width - 20,
              }}
              onPress={() =>
                navigation.navigate('bookingAuthenticationOfferCalculate', {
                  merchant: merchantDataById,
                  type: 'merchant',
                })
              }
            />
          ) : null}
        </View>

        {loading && <DefaultOverLayLoading />}
      </ScrollContainerWithNavHeader>
      <MyModal visible={modalVisible} onClose={toggleModal} />
    </>
  );
};
export const MerchantDetails = baseScreen(merchantDetails, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
