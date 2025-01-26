import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  transactionHistoryCard: ViewStyle;
  nameText: TextStyle;
  priceText: TextStyle;
  storeNameContainer: ViewStyle;
  storeNameText: TextStyle;
  dateText: TextStyle;
  priceArrowContainer: ViewStyle;
  arrowView: ViewStyle;
  dateTextMI: TextStyle;
  priceTextMI: TextStyle;
  datePaidWayContainer: ViewStyle;
  otherInfoText: TextStyle;
  historyContainer: ViewStyle;
  dateStyle: TextStyle;
  amountStyle: TextStyle;
  paidContainer: ViewStyle;
  paidText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    transactionHistoryCard: {
      width: wp(248),
      minHeight: hp(123),
      backgroundColor: common.transparent,
      borderRadius: 20,
      padding: hp(18),
      borderWidth: 1,
      borderColor: common.creamyWhite,
    },
    nameText: {
      fontSize: hp(12),
      marginTop: hp(5),
    },
    priceArrowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    arrowView: {
      width: hp(16),
      height: hp(16),
    },
    priceText: {
      fontSize: hp(20),
    },
    storeNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(8),
    },
    storeNameText: {
      fontSize: hp(12),
    },
    dateText: {
      fontSize: hp(12),
    },
    dateTextMI: {
      fontSize: hp(20),
    },
    priceTextMI: {
      fontSize: hp(12),
    },
    datePaidWayContainer: {
      marginTop: hp(28),
      justifyContent: 'center',
    },
    otherInfoText: {
      fontSize: hp(12),
      marginStart: wp(10),
    },
    historyContainer: {
      borderRadius: hp(12),
      shadowOffset: {
        width: 0,
        height: hp(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      alignSelf: 'center',
      width: wp(343),
    },
    dateStyle: {
      color: common.blueGray,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: hp(24),
      marginBottom: hp(4),
    },
    amountStyle: {
      color: '#31363F',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: hp(32),
    },
    paidContainer: {
      paddingHorizontal: wp(16),
      paddingVertical: hp(8),
      backgroundColor: '#ECFDF3',
      borderRadius: 20,
    },
    paidText: {
      color: '#039754',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: hp(24),
    },
  };
};

export default StyleSheet.create(styles);
