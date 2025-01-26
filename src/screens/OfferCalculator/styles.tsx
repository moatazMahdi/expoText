import { Theme } from 'elephanz-rn-ui';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  inputContainer: ViewStyle;
  inputStyle: TextStyle;
  priceContainer: ViewStyle;
  calculatedAdminFees: TextStyle;
  adminFeesDisclaimer: TextStyle;
  inputTitleText: TextStyle;
  itemText: TextStyle;
  itemContainer: ViewStyle;
  amountContainer: ViewStyle;
  amountValue: TextStyle;
  amountTitle: TextStyle;
  errorMessage: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    inputTitleText: {
      fontSize: hp(16),
      marginTop: hp(25),
      marginHorizontal: wp(20),
    },
    adminFeesDisclaimer: {
      color: common.grey,
      marginHorizontal: wp(22),
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
      // fontWeight: '800',
      marginHorizontal: wp(20),
    },
    amountTitle: {
      fontSize: hp(12),
      fontWeight: '600',
      marginHorizontal: wp(20),
    },
    errorMessage: {
      alignSelf: 'stretch',
      color: 'red',
      marginHorizontal: wp(20),
    },
  };
};

export default StyleSheet.create(styles);
