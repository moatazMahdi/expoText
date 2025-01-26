import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Dimensions,
} from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';
import { tempTranslate } from 'src/utils/HelpersFunctions';

interface IStyles {
  balanceCard: ViewStyle;
  BalanceText: TextStyle;
  limitText: TextStyle;
  creditUpgradeView: ViewStyle;
  applyText: TextStyle;
  YouHave: TextStyle;
  CardFooter: ViewStyle;
  PointText: TextStyle;
  TextEGp: TextStyle;
  ExpandedOn: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;
  const width = '100%';
  const marginTop = tempTranslate('0%', '10%');
  return {
    balanceCard: {
      alignItems: 'flex-start',
      width: wp(335),
      backgroundColor: common.otherBlue,
      alignSelf: 'center',
      borderTopRightRadius: 20,
      borderRadius: 20,
      padding: 16,
      marginBottom: hp(26),
      borderWidth: 1,
      borderColor: common.otherBlue,
      marginVertical: hp(24),
    },
    PointText: {
      fontSize: hp(18),
      fontWeight: '800',
      color: common.white,
      // backgroundColor: 'gray',
    },
    limitText: {
      fontSize: hp(12),
      fontWeight: '400',
      color: common.white,
      textAlign: 'center',
      alignSelf: 'center',
      // backgroundColor: 'red',
      textAlignVertical: 'center',
    },
    creditUpgradeView: {
      flexDirection: 'row',
      marginTop: hp(20),
      alignItems: 'center',
      alignSelf: 'center',
    },

    applyText: {
      fontSize: hp(11),
      color: common.white,
    },
    YouHave: {
      fontSize: hp(12),
      fontWeight: '700',
      color: common.white,
      marginTop: marginTop,
      // backgroundColor: 'black',
    },
    CardFooter: {
      width: width,
      height: hp(62),
      backgroundColor: common.white,
      borderRadius: hp(8),
      flexDirection: 'row',
      paddingHorizontal: wp(16),
      paddingVertical: hp(8),
      justifyContent: 'space-between',
    },
    BalanceText: {
      fontSize: hp(18),
      fontWeight: '800',
      color: common.white,
    },
    TextEGp: {
      fontSize: hp(12),
      fontWeight: '500',
      color: common.white,
    },
    ExpandedOn: {
      fontSize: hp(12),
      fontWeight: '400',
      color: common.white,
    },
  };
};

export default StyleSheet.create(styles);
