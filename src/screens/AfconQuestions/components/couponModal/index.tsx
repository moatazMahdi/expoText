import React, { useEffect } from 'react';
import { Pressable, ToastAndroid, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Lottie from 'lottie-react-native';
import moment from 'moment';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { useLocalization, useNavigationUtils } from 'hooks';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DefaultModal from 'src/components/DefaultModal';
import { wp } from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import { Assets } from 'assets';
import styles from './styles';

const CouponModal: React.FC<any> = (props) => {
  const { voucher, onCloseModal, modalVisible, stores } = props;

  const merchant = tempTranslate(
    voucher?.merchantName?.en,
    voucher?.merchantName?.ar,
  );
  const percentage = voucher?.value;
  const coupon = voucher?.code;
  const expiryDate = moment(voucher?.expiredAt)?.format('DD-MM-YYYY');

  const { selectStyle } = useStyles(styles);
  const { goBack } = useNavigationUtils();
  const { translate } = useLocalization();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  useEffect(() => {
    if (modalVisible) {
      ApplicationAnalytics(
        { eventKey: 'user_get_afcon_voucher', type: 'STATUS' },
        stores,
      );
    }
  }, [modalVisible]);

  return (
    <DefaultModal
      hideModalViewStyle
      onCloseModal={onCloseModal ? onCloseModal : () => {}}
      isVisible={modalVisible}
      ViewContainerStyle={selectStyle('modalView')}
    >
      <Lottie
        source={creditech.Congratulations}
        autoPlay
        loop={true}
        style={selectStyle('lottieView')}
      />

      <Typography
        customStyles={() => ({
          text: {
            ...selectStyle('text_format'),
            ...selectStyle('orange_20_700'),
          },
        })}
      >
        {translate('CONGRATS')}
      </Typography>

      {merchant && percentage && coupon ? (
        <>
          <Typography
            customStyles={() => ({
              text: {
                ...selectStyle('text_format'),
                ...selectStyle('black_13_500'),
              },
            })}
          >
            {tempTranslate(
              `You have won a gift voucher with a ${percentage} discount! Use it at ${merchant} until ${expiryDate}.\n Terms and Conditions applied.`,
              `كسبت قسيمة شراء بخصم ${percentage} تستخدمها في ${merchant} حتى ${expiryDate}.\n تطبق الشروط والأحكام.`,
            )}
          </Typography>

          <View style={{ alignItems: 'center' }}>
            <Typography
              customStyles={() => ({
                text: {
                  ...selectStyle('black_16_400'),
                  ...selectStyle('text_format'),
                },
              })}
            >
              {translate('COPY_USE')}
            </Typography>
          </View>

          <View style={selectStyle('copyView')}>
            <Typography
              customStyles={() => ({
                text: { ...selectStyle('purple_12_700'), fontSize: 16 },
              })}
            >
              {coupon}
            </Typography>

            <Pressable
              style={selectStyle('rowCenterView')}
              onPress={() => {
                Clipboard.setString(coupon);
                ToastAndroid.showWithGravity(
                  translate('CODE_COPIED'),
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }}
            >
              <SvgView svgFile={creditech.Copy} width={24} height={24} />

              <Typography
                customStyles={() => ({
                  text: {
                    ...selectStyle('purple_12_700'),
                    fontSize: 16,
                    marginStart: wp(5),
                  },
                })}
              >
                {translate('COPY')}
              </Typography>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Typography
            customStyles={() => ({
              text: {
                ...selectStyle('black_13_500'),
                ...selectStyle('text_format'),
              },
            })}
          >
            {translate('GET_READY_SHOP')}
          </Typography>
        </>
      )}

      <DefaultButton
        buttonStyle={[
          selectStyle('buttonStyle'),
          selectStyle('modalButtonStyle'),
        ]}
        title={translate('GO_HOME')}
        titleStyle={selectStyle('T12_500')}
        onPress={() => {
          onCloseModal ? onCloseModal() : null;
          goBack();
        }}
      />
    </DefaultModal>
  );
};

export default CouponModal;
