import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  TextInputViewStyle:ViewStyle,
  TextInputContainer:ViewStyle,
  CloseIconStyle:ViewStyle
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    TextInputViewStyle:{width:'100%',marginHorizontal:0,marginTop:0},
    TextInputContainer:{width:"100%",height:hp(48),borderRadius:44,borderColor:common.cardGray,justifyContent:'flex-start',},
    CloseIconStyle:{marginEnd:wp(10)},
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
