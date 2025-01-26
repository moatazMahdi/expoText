import React, {useEffect, useState} from 'react';
import {View, Alert, Pressable} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import DefaultSlider from 'src/components/DefaultSlider';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import styles from './styles';
import DefaultButton from 'src/components/DefaultButton';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import DefaultModal from 'src/components/DefaultModal';
import VoucherView from 'src/components/VoucherView';
import {OfferStatus} from 'shared';
import ProgressiveImage from 'src/components/ProgressiveImage';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import FloatingActionButton from 'src/components/FloatingActionButton';
import {BottomContainer} from 'src/components/BottomContainer';
import {getCurrency} from 'src/utils/HelpersFunctions';
import {hp} from 'src/utils/Dimensions/dimen';
import FastImage from 'react-native-fast-image';
import {Assets} from 'assets';
import SvgView from 'src/components/SvgView';

interface RedeemPointsInterface {
  selectedItem: {
    id: number;
    image: string;
    redeemLimit: number[];
    name: string;
    cashback?: boolean;
  };
  closeModal: () => void;
}

const redeemPoints: React.FC<RedeemPointsInterface> = ({
  selectedItem,
  closeModal,
}) => {
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;
  const params = useRoute().params as RedeemPointsInterface;
  const {selectStyle} = useStyles(styles);
  const stores = useStores();
  const {goBack} = useNavigationUtils();
  const {translate} = useLocalization();
  const userId = stores.backend.users.userData?.id;
  const item = selectedItem;

  const [sliderValue, setSliderValue] = useState<number>(0);

  const [selectedVoucher, setSelectedVoucher] = useState<{}>(null);

  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);

  const [redeemedVoucher, setRedeemedVoucher] = useState<{}>(null);

  const [showModal, setShowModal] = useState(false);

  const [voucherValues, setVoucherValues] = useState<{}[]>([]);

  const data = stores.backend.wallet.vouchers.data;
  const userWallet = stores.backend.wallet.userWallet.data;

  useEffect(() => {
    stores.backend.wallet.vouchers.updateOptions({
      type: item?.cashback ? OfferStatus.CASHBACK : OfferStatus.DISCOUNT,
    });
  }, []);

  useEffect(() => {
    if (sliderValue) {
      voucherValues &&
        voucherValues?.forEach(voucher => {
          if (voucher?.Value === sliderValue) {
            setSelectedVoucher(voucher);
          }
        });
    }
  }, [sliderValue]);

  useEffect(() => {
    const merchantType = item?.cashback ? 'Contact' : 'All Merchants';
    if (data && data.length > 0) {
      setVoucherValues(data?.filter(item => item?.Merchant === merchantType));
    }
  }, [data]);

  const onCloseModal = () => {
    setShowModal(false);
    goBack();
  };

  const renderRedeemedVoucher = () => {
    return (
      <VoucherView
        voucherNumber={redeemedVoucher?.code}
        onCloseModal={onCloseModal}
        brandName={item?.name}
        description={redeemedVoucher?.description}
      />
    );
  };

  const renderRedeemedVoucherModal = () => {
    return (
      <DefaultModal bottom onCloseModal={onCloseModal} isVisible={showModal}>
        {/* <FloatingActionButton /> */}
        {renderRedeemedVoucher()}
      </DefaultModal>
    );
  };

  const renderSlider = () => {
    let steps = [];
    let minVal = 0;
    let maxVal = 5000;
    if (voucherValues && voucherValues.length > 0) {
      minVal = voucherValues[0]?.Value;
      maxVal = voucherValues[voucherValues?.length - 1]?.Value;
      steps = voucherValues?.map(item => item?.Value);
      steps.unshift(0);
    }
    const handleDecreaseBackgroundColor =
      sliderValue === 0 ? '#E3E8EF' : '#FD8326';
    const handleIncreaseBackgroundColor =
      sliderValue === maxVal ? '#E3E8EF' : '#FD8326';
    const handleDecreaseTextColor = sliderValue === 0 ? '#98A2B3' : '#98A2B3';
    const handleIncreaseTextColor =
      sliderValue === maxVal ? '#E3E8EF' : '#FD8326';

    const handleIncrease = () => {
      const currentIndex = steps.indexOf(sliderValue);
      const nextIndex =
        currentIndex < steps.length - 1 ? currentIndex + 1 : currentIndex;
      setSliderValue(steps[nextIndex]);
    };

    const handleDecrease = () => {
      const currentIndex = steps.indexOf(sliderValue);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
      setSliderValue(steps[prevIndex]);
    };

    return (
      voucherValues &&
      voucherValues.length > 0 && (
        <View>
          <View
            style={{
              width: '100%',
              height: 70,
              backgroundColor: 'white',
              borderRadius: 10,
              flexDirection: 'row',
              paddingVertical: 11,
              paddingHorizontal: 15,
              alignItems: 'center',
            }}>
            <FastImage
              source={{uri: item?.image}}
              style={{
                width: 48,
                height: 48,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#E6E6E6',
              }}
            />
            <Typography
              customStyles={() => ({
                text: {
                  color: '#081F6F',
                  fontWeight: '700',
                  fontSize: 16,
                  marginStart: 10,
                  maxWidth: 206,
                  lineHeight: 24,
                },
              })}>
              How much do you want to redeem?
            </Typography>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              paddingHorizontal: 48,
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginVertical: 24,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Pressable
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: handleDecreaseBackgroundColor,
                }}
                onPress={handleDecrease}>
                <SvgView svgFile={creditech.decrease} width={24} height={24} />
              </Pressable>
              <Typography
                customStyles={() => ({
                  text: {
                    color: handleDecreaseTextColor,
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 24,
                  },
                })}>
                {0}
              </Typography>
            </View>
            <View
              style={{
                width: 215,
                height: 48,
                borderRadius: 64,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 16,
                borderColor: '#E6E6E6',
                backgroundColor: '#FFFFFF',
              }}>
              <Typography
                customStyles={() => ({
                  text: selectStyle('redeemTextTill'),
                })}>
                {sliderValue}
                <Typography
                  customStyles={() => ({
                    text: {
                      color: '#C7C8CC',
                      fontSize: 12,
                      fontWeight: '400',
                      lineHeight: 26,
                    },
                  })}>
                  {' '}
                  {getCurrency()}
                </Typography>
              </Typography>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Pressable
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: handleIncreaseBackgroundColor,
                }}
                onPress={handleIncrease}>
                <SvgView svgFile={creditech.increase} width={24} height={24} />
              </Pressable>
              <Typography
                customStyles={() => ({
                  text: {
                    color: handleIncreaseTextColor,
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 24,
                  },
                })}>
                {maxVal}
              </Typography>
            </View>
          </View>
        </View>
      )
    );
  };

  const updateUserVouchers = () => {
    stores.backend.wallet.userVouchers.updateOptions({
      userId,
    });
    stores.backend.wallet.userVouchers.fetch();
  };

  const getVoucherCode = async () => {
    if (userWallet?.TotalPoints < selectedVoucher?.Points) {
      Alert.alert('', translate('INSUFFICIENT_POINTS'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
      return;
    }
    setRedeemedVoucher(null);
    try {
      setIsClaimLoading(true);
      await stores.backend.wallet.addVoucher(
        userId,
        `${selectedVoucher?.OfferNumber}`,
      );
      await stores.backend.wallet.userWallet.fetch(userId?.toString());
      ApplicationAnalytics(
        {
          eventKey: 'vouchers_claim_redeemPoints',
          type: 'CTA',
          parameters: {voucherCode: selectedVoucher?.Title},
        },
        stores,
      );
      setIsClaimLoading(false);
      setRedeemedVoucher(stores.backend.wallet.redeemVoucher);
      updateUserVouchers();
      setShowModal(true);
      closeModal();
    } catch (error) {
      setIsClaimLoading(false);
      if (error.response?.data?.message) {
        Alert.alert('', error?.response?.data?.message, [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      } else {
        Alert.alert('', translate('GENERIC_ERROR_MESSAGE'), [
          {text: translate('GENERIC_CONFIRM')},
        ]);
      }
    }
  };

  return (
    <View style={{}}>
      {renderSlider()}
      <DefaultButton
        loading={isClaimLoading}
        disabled={sliderValue === 0 || !userWallet?.TotalPoints}
        onPress={() => {
          getVoucherCode();
        }}
        title={translate('CLAIM')}
      />

      {renderRedeemedVoucherModal()}
    </View>
  );
};

export const RedeemPoints = baseScreen(redeemPoints, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
