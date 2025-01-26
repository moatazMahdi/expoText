import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Dimensions } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  titleText: TextStyle;
  imageStyle: ImageStyle;
  branchDetails: ViewStyle;
  detailsText: TextStyle;
  modalTitleText: TextStyle;
  itemText: TextStyle;
  fullImage: ImageStyle;
  imageAddress: TextStyle;
  locationCircle: ViewStyle;
  locationCircleCard: ViewStyle;
  merchantImageMap:ImageStyle
  merchantMapTitle:TextStyle
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  const cardHeight = wp(330);
  return {
    cardContainer: {
      width: cardHeight,
      minHeight: hp(204),
      backgroundColor: common.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: common.white
    },
    titleText: {
      fontSize: hp(14),
      fontWeight: '300',
      marginBottom: hp(2),
      color: common.black
    },
    imageStyle: {
      justifyContent: 'center',
      width: wp(328),
      height: hp(130),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    },
    branchDetails: {
      padding: hp(10)
    },
    detailsText: {
      fontSize: hp(10),
      marginTop: hp(2)
    },
    modalTitleText: {
      fontSize: hp(24),
      fontWeight: '700'
    },
    itemText: {
      fontSize: hp(15),
      marginStart: wp(45)
    },
    fullImage: {
      width: Dimensions.get('screen').width,
      height: hp(439),
      justifyContent: 'center'
    },
    imageAddress: {
      fontSize: hp(10),
      color: common.white,
      textAlign: 'center'
    },
    locationCircle: {
      width: hp(100),
      height: hp(100),
      position: 'absolute',
      top: hp(89),
      right: wp(114),
      backgroundColor: common.darkOrange,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    locationCircleCard: {
      width: hp(60),
      height: hp(60),
      position: 'absolute',
      top: hp(5),
      right: wp(100),
      backgroundColor: common.darkOrange,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    merchantImageMap: {
      width: '100%', 
      height: hp(102), 
      borderWidth: 2 ,
      borderColor:common.mapBorder,
      borderRadius:hp(16)
     },
     merchantMapTitle:{
       marginTop:hp(8),
       fontSize:16,
       fontWeight:'700',
       color:common.black
     }
  };
};

export default StyleSheet.create(styles);
