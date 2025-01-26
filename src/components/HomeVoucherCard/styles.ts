import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  imageStyle: ImageStyle;
  redeemTextTill: TextStyle;
  cardContainer: ViewStyle;
  contentContainer: ViewStyle;
  companyText: TextStyle;
  bookingAuthCardContainer:ViewStyle;
  bookingAuthImageStyle:ImageStyle;
  bookingAuthRedeemTextTill:TextStyle;
  bookingAuthRedeemTextSubTitle:TextStyle
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    contentContainer: {
      // height: hp(78),
      // width: wp(120),
      borderRadius: 6,
    },
    cardContainer: {
      // alignItems: 'center',
      height: hp(150),
      width: wp(166),
      backgroundColor: common.white,
      borderRadius: 6,
      padding: wp(6),
      marginHorizontal: wp(5),
      shadowColor: common.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 1,
    },
    imageStyle: {
      height: hp(87),
      width: wp(154),
      borderRadius: wp(4),
    },
    redeemTextTill: {
      fontSize: hp(10),
      marginTop: hp(2),
      color: '#828282',
    },
    companyText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: hp(10),
      color: common.darkBlue,
    },
    bookingAuthCardContainer:{
      width:Dimensions.get("window").width/2 - 23,
      backgroundColor: common.white,
      borderRadius: 6,
      padding: wp(6),
      marginEnd:16
    },
    bookingAuthImageStyle:{
      height: hp(82),
      width:"100%",
      borderRadius: wp(4),
      borderWidth:1,
      borderColor:common.cardGray
    },
    bookingAuthRedeemTextTill:{
      marginTop: hp(8),
      fontWeight:"700",
      color:common.black,
    },
    bookingAuthRedeemTextSubTitle:{
      marginTop: hp(2),
      fontWeight:"400",
      color:common.blueGray,
    }
  };
};

export default StyleSheet.create(styles);
