import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  bookingAuthCardSty: ViewStyle;
  bookingAuthCardImage:ImageStyle;
  cardTitle:TextStyle;
  cardSubtitle:TextStyle;
  cardOffer:TextStyle;
  priceText:TextStyle;
  priceSubText:TextStyle;
  statusContainer:ViewStyle;
  statusText:TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    bookingAuthCardSty: {
      width: '100%',
      paddingVertical: hp(9),
      paddingHorizontal: wp(8),
      flexDirection: 'row',
      justifyContent:'space-between'
    },
    bookingAuthCardImage: {
      width: wp(75),
      height: hp(50),
      marginEnd:hp(12)
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: common.black,
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 24,
      color: common.dropDownText,
      maxWidth:wp(90)
    },
    cardOffer: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 24,
      color: common.black,
      width:wp(160)
    },
    priceText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: common.brightGreen,
    },
    priceSubText: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 24,
      color: common.brightGreen,
    },
    statusContainer: {
      paddingHorizontal: 12,
      borderRadius: 40,
      justifyContent: 'center',
      height: 24,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '700',
    },
  };
};

export default StyleSheet.create(styles);
