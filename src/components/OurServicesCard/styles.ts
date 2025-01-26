import { StyleSheet, ViewStyle, TextStyle, I18nManager, ImageStyle, Dimensions, Platform } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  cardContainer: ViewStyle;
  imageStyle: ImageStyle;
  textButtonContainer: ViewStyle;
  linearGradientView: ViewStyle;
  titleStyle: TextStyle;
  blurView: ViewStyle;
  descStyle: TextStyle;
  knowMoreButton: ViewStyle;
  buttonText: TextStyle;
  androidBlurView: ViewStyle;
  descStyleEn: TextStyle;
  imageStyleSearch: ImageStyle;
  searchNameContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common }
  } = theme;

  const width = 222.6;
  return {
    cardContainer: {
      width: wp(width),
      overflow: 'hidden',
      borderRadius: 20,
      // height: hp(282),
      backgroundColor: common.white
    },
    imageStyle: {
      width: wp(width),
      height: hp(116),
      borderRadius: 20
    },
    textButtonContainer: {
      width: wp(width),

      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: 'transparent',
      zIndex: 200
    },
    blurView: {
      width: wp(width),
      height: hp(202),
      position: 'absolute',
      top: hp(140)
    },
    linearGradientView: {
      width: wp(width),
      height: hp(202),
      position: 'absolute',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    },
    titleStyle: {
      fontSize: hp(16),
      fontWeight: '500',
      color: common.darkBlue,
      marginTop: hp(16),
      marginHorizontal: wp(17)
    },
    descStyle: {
      fontSize: hp(12),
      fontWeight: '400',
      marginTop: hp(6),
      marginHorizontal: wp(17),
      color: common.darkBlue
    },
    descStyleEn: {
      fontSize: hp(12),
      fontWeight: '400',
      marginTop: hp(6),
      marginHorizontal: wp(17),
      color: common.darkBlue,
      lineHeight: hp(18)
    },
    knowMoreButton: {
      width: wp(221),
      height: hp(40),
      backgroundColor: common.yellowOrange,
      borderRadius: 36,
      position: 'absolute',
      alignSelf: 'center',
      bottom: hp(14),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 300,
      elevation: 0
    },
    buttonText: {
      color: common.white,
      fontSize: hp(14)
    },
    androidBlurView: {
      backgroundColor: 'rgba(255,255,255,0.8)'
    },
    imageStyleSearch: {
      width: wp(200),
      height: hp(112),
      borderRadius: 19,
      backgroundColor: common.white
    },
    searchNameContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  };
};

export default StyleSheet.create(styles);
