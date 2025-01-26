import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { wp } from '../../utils/Dimensions/dimen';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  balanceCard: ViewStyle;
  BalanceText: TextStyle;
  limitText: TextStyle;
  creditUpgradeView: ViewStyle;
  applyText: TextStyle;
  totalBalanceText: TextStyle;
  buttonText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    balanceCard: {
      alignItems: 'flex-start',
      width: wp(335),
      backgroundColor: common.white,
      alignSelf: 'center',
      borderRadius: hp(12),
      padding: wp(16),
      marginBottom: hp(26),
      shadowColor: common.white,
      shadowOffset: {
        width: 0,
        height: hp(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    BalanceText: {
      fontSize: hp(24),
      fontWeight: '700',
      color: common.black,
      lineHeight: hp(32),
      marginBottom: hp(8),
    },
    limitText: {
      fontSize: hp(12),
      fontWeight: '400',
      color: common.black,
      lineHeight: hp(16),
    },
    creditUpgradeView: {
      flexDirection: 'row',
      marginTop: hp(20),
      alignItems: 'center',
      alignSelf: 'center',
    },
    applyText: {
      fontSize: hp(11),
      color: common.darkBlue,
    },
    totalBalanceText: { fontSize: 12, fontWeight: '700', marginBottom: hp(8) },
    buttonText: {
      fontSize: hp(14),
      fontWeight: '400',
      lineHeight: hp(24),
      color: common.black,
    },
  };
};

export default StyleSheet.create(styles);
