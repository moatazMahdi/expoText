import { View, Pressable, I18nManager, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { baseScreen } from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import FastImage from 'react-native-fast-image';
import { hp } from 'src/utils/Dimensions/dimen';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DefaultFlatList from 'src/components/DefaulFlatList';
import styles from './styles';
import DefaultButton from 'src/components/DefaultButton';
import { useLocalization, useStores } from 'hooks';
import DefaultModal from 'src/components/DefaultModal';
import VoucherView from 'src/components/VoucherView';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import moment from 'moment';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

const merchantsOnlineDetails = ({ route }) => {
  const { data, title } = route.params;
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [redeemInfo, setRedeemInfo] = useState({});
  const [voucherGenerated, setVoucherGenerated] = useState(false);
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const stores = useStores();
  const isRTL = I18nManager.isRTL;




  const handleConfirmation = () => {
    const redeemCashbackVoucher = async () => {
      try {
        setIsLoading(true);
        const amount = parseInt(selectedItem['enName']);
        const response = await stores?.backend?.users?.redeemCashbackVoucher(
          data.id,
          data.arName,
          data.enName,
          amount,
          'N',
        ).then((response) => {
          ApplicationAnalytics(
            { eventKey: 'Voucher_Generated', type: 'CTA' },
            stores
          )
          setRedeemInfo(response);
        });
        setIsLoading(false);
        setShowModal(true);
      } catch (error) {
        Alert.alert(
          '',
          error.response.data.message,
          [{ text: translate('GENERIC_CONFIRM') }],
        );
        setIsLoading(false);
      }
    };

    redeemCashbackVoucher();
    if (selectedItemIndex !== null) {
      setSelectedItem(data.types[selectedItemIndex]);
    }
  };
  const onCloseModal = () => {
    setShowModal(false);
  };

  const renderQRCodeView = () => {
    return (

      <VoucherView
        voucherNumber={redeemInfo?.voucherCode}
        onCloseModal={onCloseModal}
        description={`${translate('REDEEMED_VOUCHER')} ${isRTL ? data.arName : data.enName + ' Enjoy your shopping!'
          } `}
        brandName={redeemInfo.amount}
        merchantTitle={isRTL ? data.arName : data.enName}
        footerText={`${translate('VOUCHER_VALID_TILL')} ${moment(redeemInfo.expiredDate, "DD/MM/YYYY")?.format('DD-MM-YYYY') || ''
          } ${translate('TERMS_CONDITIONS_APPLIED')}`}
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

  const renderRedeemableMerchant = ({ item, index }) => {
    const marginStart = index % item === 0 ? 0 : 8;
    const isSelected = index + 1 == selectedItem?.id;
    const onPressHandler = () => {
      setSelectedItemIndex(index);
      setSelectedItem(item);
    };
    return (
      <Pressable
        disabled={IsLoading}
        style={[selectStyle('RedeemCard'), { marginStart: marginStart }]}
        onPress={onPressHandler}
      >
        <Typography
          customStyles={() => ({
            text: selectStyle('RedeemMony'),
          })}
        >
          {I18nManager.isRTL ? item?.arName : item?.enName}
        </Typography>
        <View
          style={[
            selectStyle('SelectedItem'),
            {
              borderColor: isSelected ? '#FD8326' : '#E6E6E6',
            },
          ]}
        >
          {isSelected && <View style={selectStyle('SelectedItemBackground')} />}
        </View>
      </Pressable>
    );
  };

  const renderRedeemList = () => {
    return (
      <DefaultFlatList
        flatListProps={{
          contentContainerStyle: {
            paddingLeft: 0,
            alignItems: 'flex-start',
            marginTop: hp(24),
          },

          data: data?.types,
          renderItem: renderRedeemableMerchant,
          horizontal: true,
          keyExtractor: (item, index) => index + '',
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {IsLoading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        title={title}
        scrollViewStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          alignItems: 'center',
        }}
      >
        <View style={selectStyle('MerchantImageCard')}>
          <FastImage
            source={{
              uri: data?.imageURL,
            }}
            style={{ width: 209, height: 139 }}
            resizeMode="contain"
          />
        </View>
        <Typography
          customStyles={() => ({
            text: selectStyle('RedeemText'),
          })}
        >
          {translate('SELECT_VOUCHER')}
        </Typography>
        {renderRedeemList()}
        {renderQRModal()}
        <DefaultButton
          disabled={selectedItem === null}
          title={translate('LOGIN_CONFIRM')}
          onPress={handleConfirmation}
          loading={IsLoading}
        />
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const MerchantsOnlineDetails = baseScreen(merchantsOnlineDetails, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
