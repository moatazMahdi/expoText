import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
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
import { hp } from 'src/utils/Dimensions/dimen';

interface RedeemPointsInterface {
  item: {
    id: number;
    image: string;
    redeemLimit: number[];
    name: string;
    cashback?: boolean;
  };
}

const RedeemPoints: React.FC = () => {
  const params = useRoute().params as RedeemPointsInterface;
  const {selectStyle} = useStyles(styles);
  const stores = useStores();
  const {goBack} = useNavigationUtils();
  const {translate} = useLocalization();
  const userId = stores.backend.users.userData?.id;
  const item = params?.item;

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
        <FloatingActionButton bot={hp(40)} />
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
    return (
      voucherValues &&
      voucherValues.length > 0 && (
        <View>
          <DefaultSlider
            value={sliderValue}
            steps={steps}
            minValue={minVal}
            maxValue={maxVal}
            setValue={setSliderValue}
          />
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
  const renderGenerateQR = () => {
    return (
      <BottomContainer>
        <DefaultButton
          loading={isClaimLoading}
          disabled={sliderValue === 0 || !userWallet?.TotalPoints}
          onPress={getVoucherCode}
          title={translate('CLAIM')}
        />
      </BottomContainer>
    );
  };

  return (
    <View>
      <ProgressiveImage
        resizeMode="cover"
        imageSource={{uri: item?.image}}
        imageStyle={selectStyle('imageStyle')}
      />
      <Typography
        customStyles={() => ({
          text: selectStyle('titleStyle'),
        })}>
        {translate('HOW_MUCH_TO_REDEEM')}
      </Typography>

      <Typography
        fontSize={34}
        fontWeight="700"
        marginTop={35}
        marginBottom={35}>
        {sliderValue + ' '}

        {getCurrency()}
      </Typography>

      {renderSlider()}
      {renderRedeemedVoucherModal()}
      {renderGenerateQR()}
    </View>
  );
};

export default RedeemPoints;
