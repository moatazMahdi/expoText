import React from 'react';
import {View, Image, BackHandler} from 'react-native';
import {Separator} from 'native-base';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useLocalization, useNavigationUtils} from 'hooks';
import DefaultButton from 'src/components/DefaultButton';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import {Typography, useTheme} from 'elephanz-rn-ui';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import {useFocusEffect} from '@react-navigation/native';
import SvgView from 'src/components/SvgView';

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const orderSummary = ({route}) => {
  const navigation = useNavigationUtils();
  const {params} = route || {};
  const {translate} = useLocalization();
  console.log('params', params);

  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);
console.log("params",params);

  let status;
  switch (params?.params?.status || params?.item?.crmStatus) {
    case tempTranslate('pending', 'معلقة'):
    case 'pending':
      status = tempTranslate('Pending', 'معلقة');
      break;
    case tempTranslate('saved', 'محفوظة'):
    case 'saved':
      status = tempTranslate('Saved', 'محفوظة');
      break;
    case tempTranslate('rejected', 'مرفوضة'):
      status = tempTranslate('Rejected', 'مرفوضة');
      break;
    case tempTranslate('expired', 'منتهية'):
      status = tempTranslate('Expired', 'منتهية');
      break;
    case tempTranslate('approved', 'ناجحة'):
      status = tempTranslate('Approved', 'ناجحة');
      break;
    case tempTranslate('Done', 'ناجحة'):
    case tempTranslate('success', 'ناجحة'):
      status = tempTranslate('Success', 'ناجحة');
      break;
    case tempTranslate('invalid', 'غير صالحة'):
      status = tempTranslate('Invalid', 'غير صالحة');
      break;
  }

  const Array = [
    {
      id: '1',
      title: translate('ID_AUTHENTICATION'),
      value: `#${
        params?.params?.bookingRequestId || params?.item?.bookingRequestId
      }`,
    },
    {
      id: '2',
      title: translate('MERCHANT_NAME'),
      value: params?.params?.merchantTitle || params?.item?.merchantTitle,
    },
    {
      id: '3',
      title: translate('BRANCH'),
      value: params?.params?.branchName || params?.item?.branchName,
    },
    {
      id: '4',
      title: translate('PRODUCT_NAME'),
      value: params?.params?.productName || params?.item?.productName,
    },
    {
      id: '5',
      title: translate('LOAN_AMOUNT'),
      value: params?.params?.loanAmount || params?.item?.loanAmount,
    },
    {
      id: '6',
      title: translate('OFFER_TYPE'),
      value: params?.params?.offerTitle || params?.item?.offerTitle,
    },
    {
      id: '7',
      title: translate('CALC_DURATION'),
      value: `${
        params?.params?.selectedDuration ||
        params?.item?.tenorTitle ||
        params?.params?.tenorTitle
      }`,
    },
    {
      id: '8',
      title: translate('PRODUCT_INSTALLMENT'),
      value: `${
        params?.params?.installmentAmount || params?.item?.installmentAmount
      }`,
    },
    {
      id: '9',
      title: translate('SERVICE_FEES'),
      value:
        params?.params?.feesAmount || params?.item?.serviceTotalFees || '0',
    },
    {
      id: '10',
      title: translate('PURCHASE_DATE_AUTH'),
      value: params?.item?.date ? params?.item?.date : formattedCurrentDate,
    },
    {
      id: '11',
      title: translate('EXPIRE_TIME'),
      value: '12:00 Am',
    },
    {
      id: '12',
      title: translate('STATUS'),
      value: status,
    },
  ];


  const RemoveFormArr =
    (params?.params?.offerTitle.length <= 2 ||
      params?.item?.offerTitle.length <= 2) &&
    Array.splice(5, 1);
  const ArrayAfterRemoved = Array;
  console.log(RemoveFormArr);

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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (
          params?.params?.status === 'pending' ||
          params?.params?.status === tempTranslate('pending', 'معلقة')
        ) {
          navigation.navigate('bookingAuthentication');
          return true;
        } else {
          navigation.goBack();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [params?.params?.status, navigation]),
  );

  const StatuesColors = status => {
    switch (status) {
      case tempTranslate('Pending', 'معلقة'):
        return {
          backgroundColor: '#FDF6E7',
          textColor: '#FDB022',
        };
      case tempTranslate('Approved', 'ناجحة'):
      case tempTranslate('Done', 'ناجحة'):
      case tempTranslate('Success', 'ناجحة'):
        return {
          backgroundColor: '#ECFDF3',
          textColor: '#039754',
        };
      case tempTranslate('Rejected', 'مرفوضة'):
      case tempTranslate('Expired', 'منتهية'):
      case tempTranslate('Invalid', 'غير صالحة'):
        return {
          backgroundColor: '#FEE4E2',
          textColor: '#D92C20',
        };
      case tempTranslate('Saved', 'محفوظة'):
        return {
          backgroundColor: '#E7F7FD',
          textColor: '#228BDB',
        };
      default:
        return {
          backgroundColor: 'white',
          textColor: common.black,
        };
    }
  };

  const SummaryHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={creditech.successImage}
          style={{width: 80, height: 80}}
        />
        <Typography
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: common.black,
            marginTop: 16,
          }}>
          {translate('ORDER_SUBMITTED')}
        </Typography>
      </View>
    );
  };

  const ItemsWrapper = ({item, index}) => {
    const {backgroundColor, textColor} = StatuesColors(item.value);

    return (
      <View style={{width: '100%'}}>
        {index === 0 ? null : (
          <Separator style={{height: 1, marginVertical: 8}} />
        )}

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems:'center'
          }}>
          <Typography
            style={{
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 24,
              color: common.blueGray,
              paddingVertical: 4,
            }}>
            {item.title}
          </Typography>
          {/* {item.title === 'Statues' ? ( */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor,
              borderRadius: 40,
            }}>
            <Typography
              style={{
                fontSize: 14,
                fontWeight: '700',
                lineHeight: 24,
                color: textColor,
                maxWidth: wp(190),
              }}
              numberOfLines={1}>
              {item.value}
            </Typography>
          </View>
          {/* ) : ( */}
          {/* <Typography
              style={{
                fontSize: 14,
                fontWeight: '700',
                lineHeight: 24,
                color: common.black,
              }}
            >
              {item.value}
            </Typography> */}
          {/* )} */}
        </View>
      </View>
    );
  };

  const AlertSection = () => {
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: '#FDF6E7',
          marginTop: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 30,
        }}>
        <SvgView
          svgFile={creditech.lampCharge}
          width={20}
          height={20}
          // fill="grey"
          style={{alignSelf: 'flex-start'}}
        />
        <Typography
          style={{
            marginHorizontal: 10,
            fontSize: 12,
            fontWeight: '500',
            color: '#F79009',
            lineHeight: 16,
          }}>
          {translate('ALERT_BOOKING_AUTH_SUMMARY')}
        </Typography>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        title={translate('ORDER_SUMMERY')}
        shapeVariant="orange"
        removeCapitalization
        hideBack
        scrollViewStyle={{paddingVertical: hp(24), paddingHorizontal: 16}}>
        <SummaryHeader />
        <View
          style={{
            width: '100%',
            padding: 16,
            backgroundColor: common.white,
            borderRadius: 12,
            marginVertical: 21,
          }}>
          {ArrayAfterRemoved.map((item, index) => (
            <ItemsWrapper item={item} index={index} />
          ))}
        </View>
        {params?.params?.status || params?.item?.crmStatus === 'pending' ? (
          <AlertSection />
        ) : null}

        <DefaultButton
          variant="pending"
          title={translate('DONE')}
          titleStyle={{color: 'white', fontSize: 16, fontWeight: '700'}}
          buttonStyle={{
            backgroundColor: '#FD8326',
            height: 48,
            borderRadius: 40,
          }}
          onPress={() => {
            if (params?.params?.status === 'saved') {
              navigation.navigate('bookingAuthentication');
            } else {
              params?.params
                ? navigation.navigate('home')
                : navigation.goBack();

              // navigation.navigate('home');
              // navigation.goBack();
            }
          }}
        />
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const OrderSummary = baseScreen(orderSummary, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
