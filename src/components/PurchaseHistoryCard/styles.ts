import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  purchaseHistoryCard: ViewStyle;
  nameText: TextStyle;
  priceText: TextStyle;
  storeNameContainer: ViewStyle;
  storeNameText: TextStyle;
  progressContainer: ViewStyle;
  circleStyle: ViewStyle;
  circleFill: ViewStyle;
  dueDateText: TextStyle;
  shadowWrapper: ViewStyle;
  rowStyle: ViewStyle;
  iconStyle: ViewStyle;
  merchantText: TextStyle;
  loanItemText: TextStyle;
  detailsBtn: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    purchaseHistoryCard: {
      width: wp(303),
      padding: hp(16),
    },
    shadowWrapper: {
      shadowColor: 'rgba(50, 50, 71, 0.05)',
      shadowOffset: {
        width: 0,
        height: hp(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: common.white,
      borderRadius: hp(12),
    },
    nameText: {
      fontSize: hp(16),
      color: common.blackesh,
      fontWeight: '600',
      marginBottom: hp(3),
      flex: 1,
    },
    priceText: {
      fontSize: hp(16),
      color: common.orange,
      fontWeight: '700',
    },
    storeNameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(8),
    },
    storeNameText: {
      fontSize: hp(12),
      color: common.blackesh,
    },
    progressContainer: {
      marginTop: hp(8),
    },
    circleStyle: {
      width: hp(20),
      height: hp(20),
      borderRadius: hp(12),
      borderWidth: 2,
      borderColor: common.darkBlue,
    },
    circleFill: {
      backgroundColor: common.darkBlue,
    },
    dueDateText: {
      fontSize: hp(12),
      fontWeight: '400',
      color: common.brightGreen,
      marginTop: hp(14),
    },
    rowStyle: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    iconStyle: {
      backgroundColor: common.lightGray,
      width: '10%',
      height: wp(28),
      borderRadius: wp(14),
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: wp(6),
    },
    merchantText: {
      fontWeight: '700',
      fontSize: hp(14),
      color: common.black,
    },
    loanItemText: {
      color: common.blueGray,
      fontWeight: '400',
      marginTop: 4,
      fontSize: hp(16),
      marginHorizontal: wp(2),
    },
    detailsBtn: {
      width: wp(95),
      height: hp(32),
      backgroundColor: common.lightGray,
      borderRadius: hp(32),
      paddingHorizontal: wp(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
