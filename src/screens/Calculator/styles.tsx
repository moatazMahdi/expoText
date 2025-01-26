import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  inputTitleText: TextStyle;
  adminFeesDisclaimer: TextStyle;
  calculatedAdminFees: TextStyle;
  priceContainer: ViewStyle;
  inputStyle: ViewStyle | TextStyle;
  inputContainer: ViewStyle;
  itemText: TextStyle;
  itemContainer: ViewStyle;
  amountContainer: ViewStyle;
  amountValue: TextStyle;
  amountTitle: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    inputTitleText: {
      fontSize: hp(14),
      marginTop: hp(25),
      fontWeight: '700',
      marginHorizontal: wp(20),
    },
    adminFeesDisclaimer: {
      fontSize: hp(10),
      color: common.grey,
    },
    calculatedAdminFees: {
      fontSize: hp(12),
      color: common.grey,
    },
    priceContainer: {
      width: '100%',
    },
    inputStyle: {
      height: hp(52),
      fontWeight: '500',
      fontSize: hp(16),
    },
    inputContainer: { backgroundColor: 'white' },
    itemText: {
      fontSize: hp(16),
    },
    itemContainer: {
      height: hp(40),
      borderRadius: 20,
      backgroundColor: common.white,
      justifyContent: 'center',
      paddingHorizontal: wp(15),
      borderWidth: wp(1),
      borderColor: common.darkBlue,
    },
    amountContainer: {
      paddingLeft: hp(24),
      paddingVertical: hp(20),
      marginTop: hp(25),
      backgroundColor: common.brightGray,
    },
    amountValue: {
      fontSize: hp(24),
      marginTop: hp(2),
      fontWeight: '800',
      marginHorizontal: wp(20),
    },
    amountTitle: {
      fontSize: hp(12),
      fontWeight: '600',
      marginHorizontal: wp(20),
    },
  };
};

export default StyleSheet.create(styles);
