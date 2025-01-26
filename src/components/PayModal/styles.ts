import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {hp} from 'src/utils/Dimensions/dimen';
import {Theme} from 'elephanz-rn-ui';
import {wp} from '../../utils/Dimensions/dimen';

interface IStyles {
  modalViewContainer: ViewStyle;
  modalStyle: ViewStyle;
  modalText: TextStyle;
  paymentMethodsContainer: ViewStyle;
  paymentMethodText: TextStyle;
  radioButton: ViewStyle;
  smallCircle: ViewStyle;
  totalAmountRow: ViewStyle;
  totalAmountText: TextStyle;
  errorMessage: TextStyle;
  heightSeparator: ViewStyle;
  paymentMethodRow: ViewStyle;
  disclaimerContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: {common},
  } = theme;

  return {
    modalStyle: {justifyContent: 'flex-end', margin: 0},
    modalViewContainer: {
      width: '100%',
      backgroundColor: common.white,
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: wp(20),
    },
    modalText: {
      fontSize: hp(18),
      fontWeight: '700',
      color: common.black,
      textAlign: 'center',
    },
    paymentMethodsContainer: {
      marginTop: hp(24),
      // marginBottom: hp(12),
    },
    paymentMethodText: {
      fontSize: hp(16),
      marginStart: wp(16),
      color: '#31363F',
      fontWeight: '500',
      width: '80%',
    },
    radioButton: {
      width: hp(24),
      height: hp(24),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: common.darkOrange,
      borderWidth: 2,
    },
    smallCircle: {
      height: hp(10),
      width: hp(10),
      borderRadius: 5,
    },
    totalAmountRow: {
      borderRadius: hp(12),
      padding: hp(16),
      marginTop: hp(16),
      backgroundColor: common.backGroundColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    totalAmountText: {fontSize: 14, fontWeight: '700', color: common.black},
    heightSeparator: {
      width: wp(2),
      backgroundColor: '#E3E8EF',
      height: '100%',
      marginHorizontal: wp(8),
    },
    paymentMethodRow: {
      marginBottom: hp(12),
      borderRadius: hp(12),
      padding: hp(18),
      borderWidth: 1,
      borderColor: common.lightWhite,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    disclaimerContainer: {
      backgroundColor: '#FDF6E7',
      paddingHorizontal: wp(14),
      paddingVertical: hp(12),
      borderRadius: hp(8),
    },
    errorMessage: {
      alignSelf: 'stretch',
      color: 'red',
      marginHorizontal: wp(20),
    },
  };
};

export default StyleSheet.create(styles);
