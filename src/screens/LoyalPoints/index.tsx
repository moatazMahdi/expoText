import React, {useEffect, useState} from 'react';
import {View, RefreshControl, Pressable} from 'react-native';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ViewAll from 'src/components/ViewAll';
import PointsHistoryCard from 'src/components/PointsHistoryCard';
import {formatMoney, tempTranslate} from 'src/utils/HelpersFunctions';
import {LoadingState} from 'utils';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import LoyalPointsBalanceCard from 'src/components/LoyalPointsBalanceCard';
import {ContactRedeemAt} from 'src/utils/Constants';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import CashBack from './CashBack';
import DefaultFlatList from 'src/components/DefaulFlatList';
import FastImage from 'react-native-fast-image';
import DefaultModal from 'src/components/DefaultModal';
import {RedeemPoints} from '../RedeemPoints';
import {Assets} from 'assets';
import SvgView from 'src/components/SvgView';
import DefaultButton from 'src/components/DefaultButton';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';

const loyalPointsScreen: React.FC = () => {
  const {fromDynamicLink} =
    (useRoute().params as {
      fromDynamicLink?: boolean;
    }) || {};
  const stores = useStores();
  const navigation = useNavigationUtils();

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    translate('CASH_BACK'),
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    theme: {palette},
  } = useTheme();
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const userWallet = stores.backend.wallet.userWallet.data;
  const userVouchers = stores.backend.wallet.userVouchers.data;

  const discountMerchants = stores.backend.wallet.DiscountMerchants.data;

  const userData = stores.backend.users.userData;

  const refresh = () => {
    setRefreshing(true);
    try {
      stores.backend.wallet.userVouchers.updateOptions({
        userId: stores.backend.auth.userId,
      });
      stores.backend.wallet.DiscountMerchants.fetch();
      stores.backend.wallet.userWallet.fetch(stores.backend.auth.userId + '');
      stores.backend.users.cashbackMerchants.fetch();
      stores.backend.users.cashbackHistory.fetch();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      userData?.id &&
        (await stores.backend.wallet.userVouchers.updateOptions({
          userId: stores.backend.auth.userId,
        }));
      await stores.backend.wallet.DiscountMerchants.fetch();
      await stores.backend.wallet.userWallet.fetch(
        stores.backend.auth.userId + '',
      );
      await stores.backend.users.cashbackMerchants.fetch();
      await stores.backend.users.cashbackHistory.fetch();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (selectedOption === translate('LOYALTY_POINTS')) {
      ApplicationAnalytics({eventKey: 'LOYALTY_POINTS', type: 'CTA'}, stores);
    } else {
      ApplicationAnalytics({eventKey: 'Cash_Back', type: 'CTA'}, stores);
    }
  }, [selectedOption]);

  const onNavigateRedeemablePoints = () => {
    ApplicationAnalytics(
      {eventKey: 'loyalty_merchants_view_all', type: 'CTA'},
      stores,
    );
    navigation.navigate('pointsRedeem');
  };

  const onNavigatePointsHistory = () => {
    ApplicationAnalytics(
      {eventKey: 'loyalty_points_history', type: 'CTA'},
      stores,
    );
    navigation.navigate('pointsHistory');
  };

  const onNavigateRedeemScreen = item => {
    ApplicationAnalytics(
      {eventKey: 'loyalty_redeem_merchant', type: 'CTA'},
      stores,
    );
    // navigation.navigate('redeemPoints', { item: item });
    setSelectedItem({image: item.image, name: item.name, item});
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleRedeem = () => {
    closeModal();
  };

  const onOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  const renderModel = () => {
    return (
      <>
        <DefaultModal
          bottom
          onCloseModal={handleRedeem}
          isVisible={showModal}
          animationInTiming={200}
          ViewContainerStyle={{backgroundColor: '#FAFAFA'}}>
          <RedeemPoints selectedItem={selectedItem} closeModal={closeModal} />
        </DefaultModal>
      </>
    );
  };

  const renderRedeemablePointsItems = ({item, index}) => {
    return (
      <>
        <Pressable
          key={index}
          style={{
            width: 100,
            height: 100,
            borderWidth: 1.43,
            borderRadius: 12,
            borderColor: '#E6E6E6',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => onNavigateRedeemScreen(item)}>
          <FastImage
            source={{uri: item.image}}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode="contain"
          />
        </Pressable>
      </>
    );
  };

  const renderPointsHistoryItems = ({item}) => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginTop: 16,
        }}>
        {userWallet?.TotalValue > 1 ? (
          <PointsHistoryCard item={item} />
        ) : (
          <Typography>
            {tempTranslate('DO NOT HAVE HISTORY', 'لا يوجد سجل')}
          </Typography>
        )}
      </View>
    );
  };

  const renderEmptyLoyalty = () => {
    return (
      <View style={selectStyle('balanceCard')}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Typography
              customStyles={() => ({
                text: selectStyle('PointText'),
              })}>
              {tempTranslate(
                'You do not have loyalty points',
                'ليس لديك نقاط ',
              )}
            </Typography>
            <Typography
              customStyles={() => ({
                text: selectStyle('StartPointText'),
              })}>
              {tempTranslate(
                'You can start earning points and take advantage of offers and rewards',
                'يمكنك البدء في كسب النقاط والاستفادة من العروض والمكافآت',
              )}
            </Typography>
          </View>
          <SvgView
            svgFile={creditech.StarImage}
            width={wp(68)}
            height={hp(68)}
          />
        </View>
        <DefaultButton
          width={wp(290)}
          mt={hp(24)}
          title={translate('GET_POINTS')}
          onPress={() => navigation.navigate('shopFromMerchants')}
        />
      </View>
    );
  };

  const renderHomeLists = () => {
    const returnMAXDataToRender = () => {
      let maxDataToRender = [];
      if (userVouchers.length > 0) {
        maxDataToRender = userVouchers?.slice(0, 10);
      } else {
        maxDataToRender = userVouchers;
      }
      return maxDataToRender;
    };

    return (
      <>
        <ViewAll
          title={translate('REDEEMABLE_AT')}
          NotUpperCaseText
          onPress={onNavigateRedeemablePoints}
          data={[ContactRedeemAt, ...discountMerchants]}
          renderItems={({item, index}) =>
            renderRedeemablePointsItems({item, index})
          }
          loading={
            stores.backend.wallet.DiscountMerchants.loadingState ===
            LoadingState.LOADING
          }
          horizontal={true}
          maxNumberOfItemsToRender={5}
          style={{paddingBottom: 0}}
        />
        {userVouchers.length > 0 && (
          <View
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}>
            <ViewAll
              title={translate('POINTS_HISTORY')}
              NotUpperCaseText
              showTitle
              onPress={onNavigatePointsHistory}
              style={{paddingLeft: 0, paddingRight: 0}}
              loading={
                stores.backend.wallet.DiscountMerchants.loadingState ===
                LoadingState.LOADING
              }
            />
            <View style={{width: '100%'}}>
              <DefaultFlatList
                flatListProps={{
                  contentContainerStyle: {alignItems: 'center'},
                  // style: { backgroundColor: 'white', width: '100%' },
                  data: userData?.id ? returnMAXDataToRender() : [],
                  renderItem: renderPointsHistoryItems,
                  keyExtractor: (item, index) => index + '',
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          width: wp(343),
          backgroundColor: 'white',
          height: hp(56),
          borderRadius: 64,
          marginTop: 24,
          padding: 8,
          flexDirection: 'row',
          marginHorizontal: 16,
          justifyContent: 'space-evenly',
        }}>
        <Pressable
          style={{
            width: wp(157.5),
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 48,
            backgroundColor:
              selectedOption === translate('CASH_BACK') ? '#FD8326' : 'white',
          }}
          onPress={() => onOptionPress(translate('CASH_BACK'))}>
          <Typography
            customStyles={() => ({
              text: {
                color:
                  selectedOption === translate('CASH_BACK') ? 'white' : 'black',
              },
            })}>
            {translate('CASH_BACK')}
          </Typography>
        </Pressable>
        <Pressable
          style={{
            width: wp(157.5),
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 48,
            backgroundColor:
              selectedOption === translate('LOYALTY_POINTS')
                ? '#FD8326'
                : 'white',
          }}
          onPress={() => onOptionPress(translate('LOYALTY_POINTS'))}>
          <Typography
            customStyles={() => ({
              text: {
                color:
                  selectedOption === translate('LOYALTY_POINTS')
                    ? 'white'
                    : 'black',
              },
            })}>
            {translate('LOYALTY_POINTS')}
          </Typography>
        </Pressable>
      </View>
    );
  };

  const renderSelectedItem = () => {
    const lp = formatMoney(userWallet?.TotalPoints);

    const expiryDate = moment(userWallet?.ExpiryDate)?.format('DD-MM-YYYY');
    const c = expiryDate.toString();
    if (selectedOption === translate('LOYALTY_POINTS')) {
      return (
        <>
          {!!userWallet?.TotalValue ? (
            <>
              <LoyalPointsBalanceCard
                noDateFormat
                totalPointsValue={userWallet?.TotalValue}
                pointsToExpire={userWallet?.PointsToExpire}
                expiryDate={moment(userWallet?.ExpiryDate).format(
                  'D / MM / YYYY',
                )}
                havePoints={`${lp} `}
              />
              {renderHomeLists()}
            </>
          ) : (
            <>{renderEmptyLoyalty()}</>
          )}
        </>
      );
    } else {
      return (
        <>
          <CashBack loading={loading} />
          {/* {!!userWallet?.TotalValue ? (
            <CashBack loading={loading} />
          ) : 
            //  (
            //   <Typography
            //     customStyles={() => ({
            //       text: { alignSelf: 'center', marginTop: 24 },
            //     })}
            //   >
            //     {translate('DONT_HAVE_POINTS_YET')}
            //   </Typography>
            // )

          } */}
        </>
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      {loading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        refreshControl={
          <RefreshControl
            tintColor={palette.primary.value}
            colors={[palette.primary.value]}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        title={
          selectedOption === translate('LOYALTY_POINTS')
            ? translate('LOYALTY_POINTS')
            : translate('CASH_BACK')
        }>
        {renderModel()}
        {renderButton()}
        {renderSelectedItem()}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const LoyalPointsScreen = baseScreen(loyalPointsScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
