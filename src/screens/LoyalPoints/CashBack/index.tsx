import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { getCurrency } from 'src/utils/HelpersFunctions';
import LoyaltyPoints from 'src/components/LoyaltyPoints';
import { useLocalization, useStores } from 'hooks';
import SvgView from 'src/components/SvgView';
import ViewAll from 'src/components/ViewAll';
import { Assets } from 'assets';
import styles from './styles';
import moment from 'moment';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import InfoBox from 'src/components/InfoBox';

const CashBack = (props) => {
  const { loading } = props;
  const { translate } = useLocalization();
  const { selectStyle } = useStyles(styles);
  const navigation = useNavigation();
  const stores = useStores();

  const cashbackMerchants = stores.backend.users.cashbackMerchants.data;
  const cashbackHistory = stores.backend.users.cashbackHistory.data;

  const cashBackBalance = Intl.NumberFormat('en-US').format(
    cashbackHistory?.balance || 0,
  );

  const expiryAmount = Intl.NumberFormat('en-US').format(
    cashbackHistory?.expiryAmount || 0,
  );

  const pointsRedeemable = cashbackHistory?.pointsRedeemable;
  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: { palette },
  } = useTheme();

  const onPressShowAll = async (title, data) => {
    navigation.navigate('transactionsScreen', {
      title: title,
      data: data,
      isFromCashback: true,
    });
  };

  const merchants = [
    {
      id: 0,
      list: cashbackMerchants?.onlineMerchants,
      title: translate('ONLINE_MERCHANTS'),
      flatListEmptyString: translate('NO_DATA_FOUND'),
      onPress: (item) => {
        ApplicationAnalytics(
          {
            eventKey: `Online_Merchant_Pressed_${item.enName}`,
            type: 'CTA',
            parameters: { name: item.enName },
          },
          stores,
        );
        navigation.navigate('merchantsOnlineDetails', {
          title: translate('ONLINE_MERCHANTS'),
          data: item,
        });
      },
      onPressViewAll: () => {
        ApplicationAnalytics(
          { eventKey: 'Viewed_All_Online_Merchants.', type: 'navigation' },
          stores,
        );
        cashbackMerchants?.onlineMerchants?.length > 0
          ? onPressShowAll(
            translate('ONLINE_MERCHANTS'),
            cashbackMerchants?.onlineMerchants,
          )
          : null;
      },
    },
    {
      id: 1,
      list: cashbackMerchants?.offlineMerchants,
      title: translate('OFFLINE_MERCHANTS'),
      flatListEmptyString: translate('NO_DATA_FOUND'),
      onPressViewAll: () => {
        ApplicationAnalytics(
          { eventKey: 'Viewed_All_Offline_Merchants', type: 'CTA' },
          stores,
        );
        cashbackMerchants?.offlineMerchants?.length > 0
          ? onPressShowAll(
            translate('OFFLINE_MERCHANTS'),
            cashbackMerchants?.offlineMerchants,
          )
          : null;
      },
      onPress: (item) => {
        const newItem = { ...item, image: item.imageUrl };
        navigation.navigate('merchantDetails', {
          merchant: newItem,
          enName: newItem.enName,
          isFromCashback: true,
        });
      },
    },
  ];

  const renderCardItem = (cashbackHistory) => {
    return (
      <View style={selectStyle('CardContainer')}>
        {loading ? (
          <>
            <ActivityIndicator
              style={{ alignItems: 'center', width: '100%' }}
              color={palette.common.white}
            />
          </>
        ) : (
          <>
            <View style={{ zIndex: 1 }}>
              <Typography
                customStyles={() => ({
                  text: selectStyle('CardTextStyle'),
                })}
              >
                {translate('CASH_BACK_BALANCE')}
              </Typography>
              <Typography
                customStyles={() => ({
                  text: selectStyle('EgpPriceStyle'),
                })}
              >
                <Typography
                  customStyles={() => ({
                    text: selectStyle('PriceStyle'),
                  })}
                >
                  {cashBackBalance}{' '}
                </Typography>
                {getCurrency()}{' '}
              </Typography>
              <Typography
                customStyles={() => ({
                  text: {
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '400',
                    marginTop: 8,
                  },
                })}
              >
                {!!cashBackBalance
                  ? ''
                  : `${expiryAmount} ${getCurrency()} ${translate(
                    'POINTS_EXPIRE_IN',
                  )}  ${moment(cashbackHistory?.expiryDate, 'DD/MM/YYYY')?.format(
                    'DD-MM-YYYY',
                  ) || ''
                  }`}
              </Typography>
            </View>

            <View style={selectStyle('cashBackImage')}>
              <SvgView
                svgFile={creditech.CashBackImage}
                width={64}
                height={64}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  const TransactionsHistory = () => {
    return cashbackHistory?.history?.length > 0 ? (
      <View style={selectStyle('HistoryCardContainer')}>
        <ViewAll
          hideViewAll={cashbackHistory.history?.length < 5}
          title={translate('TRANSACTION_HISTORY')}
          showTitle
          onPress={() => {
            ApplicationAnalytics(
              { eventKey: 'Opened_Transaction_History', type: 'CTA' },
              stores,
            );
            onPressShowAll(
              translate('TRANSACTION_HISTORY'),
              cashbackHistory?.history,
            );
          }}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        />
        <View style={{ width: '100%' }}>
          <DefaultFlatList
            flatListProps={{
              contentContainerStyle: { alignItems: 'center' },
              data:
                cashbackHistory?.history?.length > 5
                  ? cashbackHistory?.history?.slice(0, 5)
                  : cashbackHistory?.history || [],
              renderItem: ({ item, index }) => {
                return (
                  <View style={selectStyle('HistoryCard')}>
                    <LoyaltyPoints item={item} />
                  </View>
                );
              },
            }}
          />
        </View>
      </View>
    ) : null;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCardItem(cashbackHistory)}

      {loading
        ? null
        : merchants.map((merchantsType) => {
          return (
            merchantsType?.list?.length === 0 ? null : <ViewAll
              NotUpperCaseText
              hideViewAll={merchantsType?.list?.length < 3}
              key={merchantsType?.id}
              title={merchantsType?.title}
              onPress={merchantsType?.onPressViewAll}
              flatListEmptyString={
                merchantsType?.list?.length == 0 &&
                merchantsType?.flatListEmptyString
              }
              data={merchantsType?.list}
              renderItems={({ item }) => (
                <Pressable
                  onPress={() => merchantsType.onPress(item)}
                  style={selectStyle('MerchantsCard')}
                >
                  <FastImage
                    source={{
                      uri: item.imageURL,
                    }}
                    style={selectStyle('image')}
                    resizeMode="contain"
                  />
                </Pressable>
              )}
              horizontal
              maxNumberOfItemsToRender={5}
              style={{ paddingBottom: 0 }}
            />
          );
        })}



      {TransactionsHistory()}
      {
        !loading && pointsRedeemable === false && <InfoBox
          messageKey="PAY_TO_UNLOCK"
          iconColor="#F79009"
          backgroundColor="#FDF6E7"
          textColor="#F79009"
          svgIcon={creditech.AttentionIcon}
        />}

    </View>
  );
};

export default CashBack;
