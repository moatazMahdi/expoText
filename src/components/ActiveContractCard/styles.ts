import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

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
  radioButton: ViewStyle;
  HistoryCard: ViewStyle;
  nameLoan: TextStyle;
  totalInstallment: TextStyle;
  monthlyInstallment: TextStyle;
  purchaseNameStore: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    purchaseHistoryCard: {
      width: wp(285),
      backgroundColor: common.white,
      borderRadius: 20,
      padding: hp(18),
      borderWidth: 1,
      borderColor: common.creamyWhite,
    },
    nameText: {
      fontSize: hp(16),
      color: common.blackesh,
      fontWeight: '600',
      marginBottom: hp(6),
      minHeight: hp(50),
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
      fontWeight: '500',
      color: common.blackesh,
      marginTop: hp(14),
    },
    radioButton: {
      backgroundColor: common.darkBlue,
      width: hp(8),
      height: hp(8),
      borderRadius: hp(4),
      alignSelf: 'center',
      marginLeft: wp(6),
    },
    nameLoan: {
      fontSize: hp(16),
      color: common.blackesh,
      fontWeight: '600',
      marginBottom: hp(8),
      flex: 1,
    },
    HistoryCard: {
      width: wp(285),
      backgroundColor: 'transparent',
      borderRadius: 14,
      padding: hp(14),
      borderWidth: 1,
      borderColor: common.brightGray,
    },
    totalInstallment: {
      fontSize: hp(16),
      color: common.blackesh,
      fontWeight: '600',
      flex: 1,
    },
    monthlyInstallment: {
      fontSize: hp(16),
      color: common.darkGrey,
      marginBottom: hp(15),
      flex: 1,
    },
    purchaseNameStore: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };
};

export default StyleSheet.create(styles);
