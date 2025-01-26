import {
  View,
  Pressable,
  ViewStyle,
  ImageBackground,
  I18nManager,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { combineMoneyCurrency, getCurrency } from 'src/utils/HelpersFunctions';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import DefaultModal from '../DefaultModal';
import VoucherView from '../VoucherView';
import { VoucherStatus } from 'shared';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import ProgressiveImage from '../ProgressiveImage';
import { useLocalization } from 'hooks';

interface PointsHistoryCardTypes {
  item: {
    Amount: number;
    BurnDate: string;
    ExpiryDate: string;
    VoucherNumber: string;
    Status: VoucherStatus;
    OfferName: string;
    BranchName: string;
    Discount: number;
    SubscriptionDate: string;
    RemainingUsage: number;
    LastModifiedAction: string;
    OfferTitle: string;
    OfferNumber: string;
    OfferDescription: string;
    MerchantImage: string;
    MerchantCategory: string;
    Actor: string;
    OfferImage: string;
  };
  containerStyle?: ViewStyle;
}

const PointsHistoryCard: React.FC<PointsHistoryCardTypes> = (props) => {
  const { item } = props;

  const { selectStyle } = useStyles(styles);

  const [showModal, setShowModal] = useState(false);

  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onShowQRModal = () => {
    setShowModal(true);
  };

  const renderQRCodeView = () => {
    return (
      <VoucherView
        voucherNumber={item?.VoucherNumber}
        onCloseModal={onCloseModal}
        description={item?.OfferDescription} //description
        brandName={item.Amount}
      />
    );
  };

  const renderQRModal = () => {
    return (
      <DefaultModal
        bottom
        onCloseModal={onCloseModal}
        isVisible={showModal}
        animationInTiming={400}
      >
        {renderQRCodeView()}
      </DefaultModal>
    );
  };
  return (
    <>
      <Pressable
        style={{
          width: '100%',
          height: 80,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: '#E6E6E6',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: 'row',
          // marginTop: 16,
        }}
        onPress={onShowQRModal}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#F0F4F8',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: item?.OfferImage }}
              style={{ width: 28, height: 28 }}
            />
          </View>
          {/* <SvgView svgFile={cashback.history} style={{ width: 48, height: 48 }} /> */}

          <View style={{ marginStart: 8 }}>
            <Typography
              customStyles={() => ({
                text: {
                  color: '#020B19',
                  fontSize: 14,
                  fontWeight: '700',
                },
              })}
            >
              {item?.MerchantCategory
                ? item.MerchantCategory
                : item?.OfferTitle}
            </Typography>
            <Typography
              customStyles={() => ({
                text: {
                  color: '#98A2B3',
                  fontSize: 12,
                  fontWeight: '500',
                },
              })}
            >
              purchase voucher
            </Typography>
          </View>
        </View>
        <View>
          <Typography
            customStyles={() => ({
              text: {
                color: '#020B19',
                fontSize: 20,
                fontWeight: '700',
                lineHeight: 26,
              },
            })}
          >
            {!item.Amount
              ? null
              : !I18nManager.isRTL && (
                  <Typography
                    customStyles={() => ({
                      text: {
                        color: '#020B19',
                        fontSize: 12,
                        fontWeight: '400',
                        lineHeight: 26,
                      },
                    })}
                  >
                    {getCurrency()}{' '}
                  </Typography>
                )}

            {item.Amount ? item?.Amount : translate('CASH_BACK')}
            {!item.Amount
              ? null
              : I18nManager.isRTL && (
                  <Typography
                    customStyles={() => ({
                      text: {
                        color: '#020B19',
                        fontSize: 12,
                        fontWeight: '400',
                        lineHeight: 26,
                      },
                    })}
                  >
                    {' '}
                    {getCurrency()}
                  </Typography>
                )}
          </Typography>
          <Typography
            customStyles={() => ({
              text:
                item?.Status === VoucherStatus.Subscribed
                  ? selectStyle('redeemTextTill')
                  : selectStyle('redeemText'),
            })}
          >
            {item?.Status === VoucherStatus.Subscribed
              ? translate('VALID_TILL')?.toUpperCase() +
                  ' ' +
                  item?.SubscriptionDate.split(' ')[0] ?? ''
              : item?.Status}
          </Typography>
        </View>
      </Pressable>
      {renderQRModal()}
    </>
  );
  return (
    <>
      <Pressable onPress={onShowQRModal}>
        <DropShadowWrapper style={selectStyle('cardDimensions')}>
          <ImageBackground
            source={creditech.cardWithImageWindow}
            imageStyle={[
              selectStyle('cardDimensions'),
              {
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              },
            ]}
            style={[
              selectStyle('cardDimensions'),
              { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
            ]}
          >
            <View style={selectStyle('contentContainer')}>
              <Typography
                marginTop={10}
                customStyles={() => ({
                  text: selectStyle('companyText'),
                })}
              >
                {item?.MerchantCategory
                  ? item.MerchantCategory
                  : item?.OfferTitle}
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Typography
                  colorHex="#000000"
                  fontSize={16}
                  fontWeight="bold"
                  marginLeft={wp(5)}
                  marginTop={hp(30)}
                  customStyles={() => ({
                    text: {},
                  })}
                >
                  <Typography
                    colorHex="#000000"
                    fontSize={22}
                    fontWeight="bold"
                    customStyles={() => ({
                      text: {},
                    })}
                  >
                    {translate('GIFT') + ' '}
                  </Typography>
                  {item.Amount
                    ? combineMoneyCurrency(item?.Amount)
                    : translate('CASH_BACK')}
                </Typography>
              </View>
              <Typography
                marginTop={25}
                customStyles={() => ({
                  text:
                    item?.Status === VoucherStatus.Subscribed
                      ? selectStyle('redeemTextTill')
                      : selectStyle('redeemText'),
                })}
              >
                {/*  */}
                {item?.Status === VoucherStatus.Subscribed
                  ? translate('VALID_TILL')?.toUpperCase() +
                      ' ' +
                      item?.SubscriptionDate.split(' ')[0] ?? ''
                  : item?.Status}
              </Typography>
            </View>
          </ImageBackground>
          <View
            style={[
              { position: 'absolute', zIndex: 0 },
              I18nManager.isRTL ? { right: 0 } : { right: 0 },
            ]}
          >
            <ProgressiveImage
              resizeMode="stretch"
              imageStyle={[
                selectStyle('imageStyle'),
                I18nManager.isRTL ? { right: 0 } : { right: 0 },
              ]}
              imageSource={{ uri: item?.OfferImage }}
            />
          </View>
        </DropShadowWrapper>
      </Pressable>
      {renderQRModal()}
    </>
  );
};

export default PointsHistoryCard;

// {/* <Pressable onPress={onShowQRModal}>
// <View style={[selectStyle('cardContainer'), containerStyle]}>
//   <Image resizeMode="contain" source={{ uri: item?.OfferImage }} style={selectStyle('imageStyle')} />
//   {item?.Amount == 0 && (
//     <Typography
//       customStyles={() => ({
//         text: selectStyle('pointsText')
//       })}
//     >
//       {item?.MerchantCategory ? item.MerchantCategory : item?.OfferTitle}
//     </Typography>
//   )}
//   {item?.Amount != 0 && (
//     <Typography
//       customStyles={() => ({
//         text: selectStyle('pointsText')
//       })}
//     >
//       {combineMoneyCurrency(item?.Amount)}
//     </Typography>
//   )}
//   <View style={selectStyle('dateRedeemContainer')}>
//     <Typography
//       customStyles={() => ({
//         text: selectStyle('dateText')
//       })}
//     >
//       {item?.ExpiryDate != '' ? formatExpiryDate(item?.ExpiryDate) : formatExpiryDate(item?.BurnDate)}
//     </Typography>
//     <Typography
//       customStyles={() => ({
//         text:
//           item?.Status == VoucherStatus.Subscribed ? selectStyle('redeemTextTill') : selectStyle('redeemText')
//       })}
//     >
//       {/*  */}
//       {item?.Status == VoucherStatus.Subscribed
//         ? tempTranslate('VALID TILL ', 'متاح الى ') + formatDayMonthDate(item?.SubscriptionDate)
//         : item?.Status}
//     </Typography>
//   </View>
// </View>
// </Pressable>
// {renderQRModal()} */}
