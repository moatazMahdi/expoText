import React, { useState } from 'react';
import { View, I18nManager, Pressable } from 'react-native';
import { getCurrency, truncateWithEllipses } from 'src/utils/HelpersFunctions';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useLocalization, useStores } from 'hooks';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';
import moment from 'moment';
import DefaultModal from '../DefaultModal';
import VoucherView from '../VoucherView';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
const LoyaltyPoints = ({ item }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const stores = useStores();
  const {
    images: {
      screens: { cashback },
    },
  } = Assets;

  const renderQRCodeView = () => {
    return (
      <VoucherView
        voucherNumber={item?.voucherCode}
        onCloseModal={() => setShowModal(false)}
        description={`${translate('REDEEMED_VOUCHER')} ${I18nManager.isRTL
            ? item.arMerchantName
            : item.enMerchantName + ' Enjoy your shopping!'
          } `}
        brandName={item.amount}
        merchantTitle={
          I18nManager.isRTL ? item.arMerchantName : item.enMerchantName
        }
        footerText={
          !item.pointsExpiryDate
            ? ''
            : ` ${translate('VOUCHER_VALID_TILL')} ${moment(item.pointsExpiryDate, 'DD/MM/YYYY')?.format(
              'DD-MM-YYYY',
            ) || ''
            } ${translate('TERMS_CONDITIONS_APPLIED')}`
        }
      />
    );
  };

  const renderQRModal = () => {
    return (
      <DefaultModal
        bottom
        onCloseModal={() => setShowModal(false)}
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
        onPress={
          item?.voucherCode !== ''
            ? () => {
              ApplicationAnalytics(
                {
                  eventKey: `Regenerated_voucher_from_history_${item.enMerchantName}`,
                  type: 'CTA',
                },
                stores,
              );
              setShowModal(true);
            }
            : () => { }
        }
        style={selectStyle('Container')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: wp(48),
              height: hp(48),
              backgroundColor: '#F0F4F8',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: hp(24),
            }}
          >
            <SvgView
              svgFile={cashback.history}
              style={{ width: wp(32), height: wp(32) }}
            />
          </View>
          <View style={{ marginStart: 8 }}>
            <Typography
              customStyles={() => ({
                text: {
                  color: '#020B19',
                  fontSize: hp(14),
                  fontWeight: '700',
                },
              })}
            >
              {I18nManager.isRTL
                ? truncateWithEllipses(item.arMerchantName, 20)
                : truncateWithEllipses(item.enMerchantName, 20)}
            </Typography>

            {item?.type !== 'E' ? null : (
              <Typography
                customStyles={() => ({
                  text: {
                    color: '#98A2B3',
                    fontSize: hp(12),
                    fontWeight: '500',
                  },
                })}
              >
                {item?.type === 'E'
                  ? `${translate('VALID_TILL')} ${moment(
                    item.pointsExpiryDate,
                    'DD/MM/YYYY',
                  )?.format('DD-MM-YYYY')}  `
                  : ''}
              </Typography>
            )}
          </View>
        </View>

        <View>
          <Typography
            customStyles={() => ({
              text: {
                color: '#020B19',
                fontSize: hp(20),
                fontWeight: '700',
                lineHeight: hp(26),
                marginLeft: wp(10),
              },
            })}
          >
            {Intl.NumberFormat('en-US').format(item?.amount || 0)}
            <Typography
              customStyles={() => ({
                text: {
                  color: '#020B19',
                  fontSize: hp(12),
                  fontWeight: '400',
                  lineHeight: hp(26),
                },
              })}
            >
              {' '}
              {getCurrency()}
            </Typography>
          </Typography>

          <Typography
            customStyles={() => ({
              text: {
                color: item?.type === 'E' ? '#039754' : '#E54444',
                fontSize: hp(12),
                fontWeight: '700',
                lineHeight: hp(24),
                alignSelf: 'flex-end',
              },
            })}
          >
            {item?.type === 'E' ? translate('EARNED') : translate('REDEEMED')}
          </Typography>
        </View>
      </Pressable>
      {renderQRModal()}
    </>
  );
};

export default LoyaltyPoints;
