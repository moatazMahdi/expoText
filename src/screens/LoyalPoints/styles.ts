import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  mainContainer: ViewStyle;
  contentContainer: ViewStyle;
  loyaltyContainer: ViewStyle;
  starSvgStyle: ViewStyle;
  loyaltyText1: TextStyle;
  loyaltyText2: TextStyle;
  latestOfferContainer: ViewStyle;
  contentWrapper: ViewStyle;
  redeemTextTill: TextStyle;
  balanceCard: ViewStyle;
  PointText: TextStyle;
  StartPointText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    contentContainer: {
      flexGrow: 1,
      backgroundColor: common.white,
    },
    loyaltyContainer: {
      width: '100%',
      marginTop: hp(32.59),
      marginBottom: hp(13),
      marginStart: wp(20),
      flexDirection: 'row',
    },
    starSvgStyle: {
      width: hp(17),
      height: hp(17),
      marginHorizontal: wp(9),
    },
    loyaltyText1: {
      fontSize: hp(16),
      color: common.darkBlue,
    },
    loyaltyText2: {
      fontSize: hp(16),
      color: common.darkBlue,
      textDecorationLine: 'underline',
    },
    latestOfferContainer: {},
    contentWrapper: {
      marginHorizontal: wp(20),
    },
    redeemTextTill: {
      color: '#081F6F',
      fontSize: 20,
      fontWeight: '700',
    },
    balanceCard: {
      width: wp(343),
      height: hp(160),
      backgroundColor: common.darkBlue,
      alignSelf: 'center',
      marginVertical: 24,
      borderRadius: 12,
      padding: 16,
    },
    PointText: {
      fontSize: 14,
      fontWeight: '700',
      color: 'white',
      lineHeight: wp(24),
    },
    StartPointText: {
      fontSize: 11,
      fontWeight: '400',
      color: 'white',
      lineHeight: wp(16),
      maxWidth: wp(219),
    },
  };
};

export default StyleSheet.create(styles);
