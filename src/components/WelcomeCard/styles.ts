import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
interface IStyles {
  PannerContainer: ViewStyle;
  PannerHomeContainer: ViewStyle;
  shadowBox: ViewStyle;
  titleText: TextStyle;
  bodyText: TextStyle;
  footerButtonText: TextStyle;
  footerContainer: ViewStyle;
  welcomeContainer: ViewStyle;
  welcomeFooterContainer: ViewStyle;
  welcomeLogo: ViewStyle;
  imageStyle: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary },
  } = theme;

  return {
    PannerContainer: {
      width: wp(335),
      alignSelf: 'center',
      borderColor: '#E2E5FF',
      borderWidth: 1,
      borderRadius: hp(20),
      padding: 10,
      backgroundColor: 'white',
    },
    PannerHomeContainer: {
      width: '100%',
      alignSelf: 'center',
      minHeight: hp(260),
      backgroundColor: 'white',
    },
    welcomeContainer: {
      width: wp(250),
      minHeight: hp(400),
    },
    shadowBox: {
      alignSelf: 'center',
    },
    welcomeLogo: {
      width: hp(229),
      height: hp(220),
      justifyContent: 'center',
    },
    imageStyle: {
      height: hp(149),
      width: wp(149),
      alignSelf: 'center',
    },
    titleText: {
      fontSize: hp(16),
      fontWeight: 'bold',
      color: primary.value,
      // marginStart: hp(20),
      // backgroundColor: 'green'
    },

    bodyText: {
      fontSize: hp(16),
      fontWeight: '400',
      color: primary.value,
      // marginStart: hp(20),
      // backgroundColor: 'yellow'
    },
    footerButtonText: {
      fontSize: hp(16),
      fontWeight: '400',
      color: primary.value,
    },
    welcomeFooterContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      marginStart: hp(20),
    },
    footerContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      // backgroundColor: 'red',
      // marginBottom: hp(5)
    },
  };
};

export default StyleSheet.create(styles);
