import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
interface IStyles {
  QRCodeViewContainer: ViewStyle;
  qrCodeTextStyle: TextStyle;
  discountAmountText: TextStyle;
  nextOrderText: TextStyle;
  discountValueText: TextStyle;
  CopyText: TextStyle;
  TextEgp: TextStyle;
  CopyContainer: ViewStyle;
  CopyTextContainer: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    qrCodeTextStyle: {
      fontSize: hp(12),
      color: common.black,
      marginTop: hp(5),
      fontWeight: '400',
    },
    QRCodeViewContainer: {
      // height: '100%',
      alignItems: 'center',
    },
    nextOrderText: {
      fontSize: hp(24),
      color: common.black,
      marginTop: hp(10),
      textAlign: 'center',
      fontWeight: '700',
      alignItems: 'center',
    },
    discountAmountText: {
      fontSize: hp(16),
      color: common.blueGray,
      textAlign: 'center',
      fontWeight: '700',
      marginTop: 16,
      lineHeight: 24,
    },
    discountValueText: {
      alignSelf: 'center',
      color: common.blueGray,
      fontWeight: '700',
      fontSize: hp(25),
    },
    CopyText: {
      color: '#FD8326',
      marginStart: 12,
    },
    TextEgp: {
      fontSize: hp(16),
      fontWeight: '500',
      color: '#31363F',
    },
    CopyContainer: {
      borderWidth: 1,
      width: '100%',
      height: 56,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderRadius: 36,
      borderColor: '#C0C1D2',
      paddingHorizontal: 16,
      marginTop: 8,
    },
    CopyTextContainer: {
      alignItems: 'center',
      padding: 10,
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#C0C1D2',
      borderRadius: 64,
    },
  };
};

export default StyleSheet.create(styles);
