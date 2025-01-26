import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {combineMoneyCurrency, tempTranslate} from 'src/utils/HelpersFunctions';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {NewPayMethod, PayMethod, ProviderType} from 'shared';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import PayWithWalletModal from '../PayWithWalletModal';
import DynamicDisclaimer from '../DynamicDisclaimer';
import {BPayModalTabsInterface} from 'src/Types';
import DefaultTextInput from '../DefaultTextInput';
import {hp} from 'src/utils/Dimensions/dimen';
import DefaultButton from '../DefaultButton';
import {Settings} from 'settings';
import SvgView from '../SvgView';
import {Assets} from 'assets';
import styles from './styles';

const PayModal: React.FC<BPayModalTabsInterface> = props => {
  const {
    earlySettlementDetails,
    getContracts,
    setLoading,
    closeModal,
    showModal,
    contract,
    isEarly,
    loading,
    screen,
    amount,
  } = props;

  const [voucherError, setVoucherError] = useState<string>('');
  const [payWithVoucher, setPayWithVoucher] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [payWithWallet, setPayWithWallet] = useState(false);

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();

  const stores = useStores();

  const animationTiming = 750;

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

  const onPayWithVoucher = () => setPayWithVoucher(true);

  const onCloseModel = () => {
    payWithVoucher && setPayWithVoucher(false);
    closeModal();
    setSelectedItem(null);
  };

  const onRequestAtDoor = async () => {
    onCloseModel();
    setLoading(true);
    try {
      await stores.backend.payment._requestDoorPayment();
      Alert.alert('', translate('SUCCESSFUL_REQUEST'), [
        {text: translate('GENERIC_CONFIRM')},
      ]);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const closePayWithWallet = () => {
    setPayWithWallet(false);
    setPhoneNumber('');
  };

  const onPay = async (paymentMethod: PayMethod) => {
    ApplicationAnalytics(
      {
        eventKey: 'pay_due_installment',
        type: 'CTA',
        parameters: {
          payment_method: paymentMethod,
          fromScreen: screen,
          ...contract,
        },
      },
      stores,
    );
    const isVoucher = paymentMethod === PayMethod.VOUCHER;
    const isNoon =
      contract?.loanTypeData?.id === 3 || +contract?.loanTypeId === 3;
    const isWallet = paymentMethod === PayMethod.WALLET;
    const provider = isVoucher
      ? ProviderType.DSQUARES
      : isNoon
      ? ProviderType.NOON
      : ProviderType.PAYMOB;
    try {
      setLoading(true);
      onCloseModel();
      isWallet && !isVoucher ? closePayWithWallet() : null;

      const data = await stores.backend.payment.createPayments({
        contractId: '' + contract?.contractId,
        contractInfo:
          Settings.config.ENV === 'development'
            ? {...contract, paymentIntegrationId: '4310305'}
            : contract,
        earlySettlement: isEarly,
        earlySettlementDetails: isEarly ? earlySettlementDetails : null,
        paymentMethod: isVoucher
          ? NewPayMethod.VOUCHER
          : NewPayMethod.CREDIT_CARD,
        provider: provider,
        voucher: isVoucher ? voucherCode : null,
      });

      ApplicationAnalytics(
        {eventKey: `successful ${paymentMethod}`, type: 'STATUS'},
        stores,
      );

      if (isWallet) {
        let response = await stores.backend.payment.requestToPay(phoneNumber);
        if (response?.success === false) {
          throw new Error('Failed to request payment');
        }
        navigation.navigate('approvalMessageScreen', {
          Message: translate('SUCCESSFUL_REQUEST'),
        });
      } else if (isVoucher) {
        Alert.alert('', translate('PAYMENT_SUCCESSFUL'), [
          {text: translate('GENERIC_CONFIRM')},
        ]);
        getContracts && getContracts();
        stores.backend.users.userData.id &&
          stores.backend.wallet.userVouchers.updateOptions({
            userId: stores.backend.auth.userId,
          });
      } else {
        navigation.navigate('paymobScreen', {
          paymentMethod: PayMethod.PAYMOB,
          provider,
          isEarly: isEarly,
          url: data?.url,
        });
      }
    } catch ({response}) {
      if (response?.data?.message && isVoucher) {
        Alert.alert(
          '',
          typeof response?.data?.message === 'string'
            ? response?.data?.message
            : response?.data?.message[0],
          [{text: translate('GENERIC_CONFIRM')}],
        );
      } else
        Alert.alert('', translate('PAYMENT_FAILED'), [
          {text: translate('GENERIC_CONFIRM')},
        ]);
    } finally {
      setLoading(false);
      isWallet && closePayWithWallet();
    }
  };

  const renderPaymentMethods = () => {
    const quickPayOptions = isEarly
      ? [
          {
            id: 0,
            name: translate('PAY_WITH_CARD'),
            icon: creditech.payWithCard,
            onPress: () => onPay(PayMethod.PAYMOB),
            payMethod: PayMethod.PAYMOB,
          },
        ]
      : [
          {
            id: 0,
            name: translate('PAY_WITH_CARD'),
            icon: creditech.payWithCard,
            onPress: () => onPay(PayMethod.PAYMOB),
            payMethod: PayMethod.PAYMOB,
          },
          // {
          //   id: 1,
          //   name: translate('PAY_WALLET'),
          //   icon: creditech.Wallet,
          //   onPress: () => setPayWithWallet(true),
          //   payMethod: PayMethod.WALLET,
          // },
          {
            id: 3,
            name: translate('VOUCHER_CODE'),
            icon: creditech.payWithVoucherIcon,
            onPress: onPayWithVoucher,
            payMethod: PayMethod.VOUCHER,
          },
          {
            id: 2,
            name: translate('REQUEST_DOOR_PAYMENT'),
            icon: creditech.House,
            onPress: onRequestAtDoor,
          },
        ];

    return (
      <>
        {selectedItem?.id === 0 ? (
          <View style={selectStyle('totalAmountRow')}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Typography
                customStyles={() => ({
                  text: {
                    ...selectStyle('totalAmountText'),
                    fontWeight: '500',
                  },
                })}>
                {translate('TOTAL')}
              </Typography>
              <View style={selectStyle('heightSeparator')} />
            </View>
            <Typography
              customStyles={() => ({
                text: selectStyle('totalAmountText'),
              })}>
              {combineMoneyCurrency(
                isEarly
                  ? +amount
                  : +(
                      contract?.nextInstallmentAmount +
                      contract?.paymobCreditCardFees +
                      contract?.latePaymentFees
                    ).toFixed(2),
              )}
            </Typography>
          </View>
        ) : null}

        <ScrollView style={selectStyle('paymentMethodsContainer')}>
          {quickPayOptions?.map((item, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedItem(item);
                }}
                style={selectStyle('paymentMethodRow')}>
                <View style={{flexDirection: 'row'}}>
                  <SvgView svgFile={item.icon} width={22} height={22} />
                  <Typography
                    customStyles={() => ({
                      text: selectStyle('paymentMethodText'),
                    })}>
                    {item.name}
                  </Typography>
                </View>

                <View
                  style={[
                    selectStyle('radioButton'),
                    item.id === selectedItem?.id
                      ? {borderWidth: 2, borderColor: common.darkOrange}
                      : {borderWidth: 1, borderColor: common.lightWhite},
                  ]}>
                  <View
                    style={[
                      selectStyle('smallCircle'),
                      {
                        backgroundColor:
                          item.id === selectedItem?.id
                            ? common.darkOrange
                            : common.white,
                      },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <DynamicDisclaimer
          customStyle={selectStyle('disclaimerContainer')}
          icon={creditech.lamp}
          iconColor="#FDF6E7"
          textColor="#D09216"
          text={translate('PAYMENT_DISCLAIMER')}
        />

        <DefaultButton
          mt={16}
          width={343}
          disabled={!selectedItem}
          title={translate('CONFIRM_PAYMENT')}
          onPress={selectedItem?.onPress}
          fromModal="applyVoucherModal"
          buttonStyle={{height: hp(50)}}
        />
      </>
    );
  };

  const renderVoucherCode = () => {
    return (
      <KeyboardAwareScrollView>
        <Typography marginTop={20} textAlign="center">
          {translate('VOUCHER_PAYMENT_DESCRIPTION')}
        </Typography>

        <DefaultTextInput
          value={voucherCode}
          placeholder={translate('VOUCHER_PAYMENT_PLACEHOLDER')}
          onchangeText={val => {
            setVoucherCode(val);
            setVoucherError(
              isNaN(+val) &&
                tempTranslate(
                  'voucher must be numbers only',
                  'يجب ان يكون كود الخصم ارقام فقط',
                ),
            );
          }}
          mt={10}
          keyboardType={'numeric'}
        />
        {voucherError?.length > 0 && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}>
            {voucherError}
          </Typography>
        )}
        <DefaultButton
          loading={loading}
          mt={20}
          mb={20}
          width={290}
          disabled={voucherError?.length > 0 || voucherCode.length < 1}
          title={translate('APPLY')}
          onPress={() => onPay(PayMethod.VOUCHER)}
          fromModal="applyVoucherModal"
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View>
      {payWithWallet ? (
        <PayWithWalletModal
          showModal={true}
          closeModal={closePayWithWallet}
          closeMain={closeModal}
          onPayWithWallet={() => onPay(PayMethod.WALLET)}
          setPhoneNumber={setPhoneNumber}
          phoneNumber={phoneNumber}
          amount={combineMoneyCurrency(
            contract?.nextInstallmentAmount +
              contract?.walletPercent +
              contract?.cPayWalletFees +
              contract?.cPayWalletFeesVat,
          )}
        />
      ) : (
        <Modal
          style={selectStyle('modalStyle')}
          animationIn={'slideInUp'}
          animationInTiming={animationTiming}
          animationOut={'slideOutDown'}
          animationOutTiming={animationTiming}
          onBackdropPress={onCloseModel}
          onBackButtonPress={onCloseModel}
          isVisible={showModal}
          backdropTransitionInTiming={animationTiming}
          backdropTransitionOutTiming={animationTiming}>
          <View style={selectStyle('modalViewContainer')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('modalText'),
              })}>
              {translate('PAY_DUE_INSTALLMENT')}
            </Typography>
            {payWithVoucher ? renderVoucherCode() : renderPaymentMethods()}
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PayModal;
