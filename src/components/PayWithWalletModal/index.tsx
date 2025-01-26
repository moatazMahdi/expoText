import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SvgView from '../SvgView';
import { useLocalization } from 'hooks';
import RowView from '../Wrappers/RowView';
import { ContinueButton } from '../ContinueButton';
import DefaultTextInput from '../DefaultTextInput';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { phoneNumberValidation, validate } from 'src/utils/Validation';
import styles from './styles';
import { Assets } from 'assets';

const PayWithWalletModal = (props) => {
  const {
    closeModal,
    showModal,
    closeMain,
    onPayWithWallet,
    phoneNumber,
    setPhoneNumber,
    amount,
  } = props;

  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  const { translate } = useLocalization();
  const { selectStyle } = useStyles(styles);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const animationTiming = 750;

  const onCloseModel = () => {
    closeModal();
    closeMain();
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setIsValidPhoneNumber(validate(value, phoneNumberValidation));
  };

  const renderPayWithWallet = () => {
    return (
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <DefaultTextInput
          inputContainer={[
            {
              backgroundColor: 'white',
              borderRadius: 20,
            },
            isValidPhoneNumber && {
              marginBottom: wp(20),
            },
          ]}
          keyboardType="number-pad"
          value={phoneNumber}
          textInputStyle={{
            height: hp(54),
            fontWeight: '500',
            fontSize: hp(16),
          }}
          mt={20}
          maxLength={11}
          placeholder={translate('ADD_MOBILE')}
          onchangeText={handlePhoneNumberChange}
        />

        {!isValidPhoneNumber && (
          <Typography
            customStyles={() => ({
              text: selectStyle('errorMessage'),
            })}
          >
            {translate('PHONE_FIELD_ERROR')}
          </Typography>
        )}

        <ContinueButton
          onContinuePressed={onPayWithWallet}
          completeForm={phoneNumber !== '' && isValidPhoneNumber}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
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
      backdropTransitionOutTiming={animationTiming}
    >
      <View
        style={{
          height: hp(320),
          width: '100%',
          backgroundColor: 'white',
          alignSelf: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: wp(20),
        }}
      >
        <RowView jc="space-between">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: hp(12),
            }}
          >
            <SvgView
              svgFile={creditech.Wallet}
              me={10}
              width={24}
              height={24}
            />

            <Typography fontWeight="500" fontSize={20}>
              {translate('PAY_WALLET')}
            </Typography>
          </View>

          <Pressable
            hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
            onPress={onCloseModel}
          >
            <SvgView svgFile={creditech.Close} mt={5} width={16} height={16} />
          </Pressable>
        </RowView>
        <Typography
          customStyles={() => ({
            text: selectStyle('modalText'),
          })}
        >
          {amount}
        </Typography>

        {renderPayWithWallet()}
      </View>
    </Modal>
  );
};
export default PayWithWalletModal;
