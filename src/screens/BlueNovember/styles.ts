import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  contentContainer: ViewStyle;
  loyaltyContainer: ViewStyle;
  loyaltyText1: TextStyle;
  loyaltyText2: TextStyle;
  latestOfferImage: ImageStyle;
  latestOfferContainer: ViewStyle;
  contentWrapper: ViewStyle;
  container: ViewStyle;
  imageWrapperStyle: ImageStyle;
  blueNovember:TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      flex: 1,
      backgroundColor: common.white,
    },
    contentContainer: {
      backgroundColor: common.white,
    },
    loyaltyContainer: {
      marginTop: hp(10),
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(20),
      paddingHorizontal: wp(20),
    },
    loyaltyText1: {
      fontSize: hp(14),
      fontWeight: '700',
      color: common.white,
    },
    loyaltyText2: {
      fontSize: hp(14),
      fontWeight: '700',
      color: common.white,
      textDecorationLine: 'underline',
      width: wp(96),
      height: hp(17),
      lineHeight: hp(19.8),
      marginLeft: wp(2),
    },
    latestOfferContainer: {},
    latestOfferImage: {
      width: wp(310),
      height: hp(204),
    },
    contentWrapper: {
      width: '100%',
      borderBottomEndRadius: 50,
      borderBottomStartRadius: 50,
      marginBottom: hp(20),
    },
    imageWrapperStyle: {
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
    blueNovember:{
      fontSize: hp(14),
      fontWeight: '700',
      color: common.white,
      // textDecorationLine: 'underline',
      // width: wp(96),
      // height: hp(17),
      lineHeight: hp(19.8),
      marginLeft: wp(2),
    }
  };
};

export default StyleSheet.create(styles);
