import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  imageStyle: ImageStyle;
  pointsText: TextStyle;
  dateRedeemContainer: ViewStyle;
  dateText: TextStyle;
  redeemText: TextStyle;
  redeemTextTill: TextStyle;
  cardDimensions: ViewStyle;
  contentContainer: ViewStyle;
  companyText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  const width = 247.6;
  return {
    cardDimensions: { width: wp(width), minHeight: hp(150), zIndex: 2 },
    contentContainer: {
      width: wp(width - 60),
      zIndex: 10,
      paddingStart: wp(19),
    },
    cardContainer: {
      width: wp(width),
      maxHeight: hp(150),
      borderRadius: 20,
      backgroundColor: common.white,
      paddingHorizontal: wp(18),
      paddingVertical: hp(21),
    },
    imageStyle: {
      width: wp(80),
      height: hp(150),
      position: 'absolute',
      zIndex: 0,
    },
    pointsText: {
      fontSize: hp(30),
      fontWeight: '400',
      marginTop: hp(22),
      color: common.black,
    },
    dateRedeemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(5),
      alignItems: 'center',
    },
    dateText: {
      fontSize: hp(10),
      color: common.black,
    },
    redeemText: {
      fontSize: hp(10),
      color: common.paleRed,
      alignSelf: 'flex-end',
      fontWeight: '500',
    },
    redeemTextTill: {
      fontSize: hp(10),
      color: common.black,
      alignSelf: 'flex-end',
      fontWeight: '500',
    },
    companyText: {
      fontSize: hp(12),
      color: common.black,
    },
  };
};

export default StyleSheet.create(styles);
