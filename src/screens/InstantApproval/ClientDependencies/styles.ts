import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  mainContainer: ViewStyle;
  shadowBox: ViewStyle;
  sliderMarkerContainer: ViewStyle;
  sliderMarkerText: TextStyle;
  sliderContainer: ViewStyle;
  peopleSVGContainer: ViewStyle;
  sliderBar: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.white,
    },
    shadowBox: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 4,
    },
    sliderMarkerContainer: {
      width: wp(46),
      height: wp(46),
      borderRadius: wp(23),
      backgroundColor: common.white,
      borderWidth: 1,
      borderColor: common.creamyWhite,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sliderMarkerText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      fontWeight: '400',
      textAlign: 'center',
      color: common.darkBlue,
    },
    sliderContainer: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    peopleSVGContainer: {
      alignSelf: 'center',
      marginTop: hp(30),
      marginBottom: hp(70),
    },
    sliderBar: {
      backgroundColor: common.darkBlue,
    },
  };
};

export default StyleSheet.create(styles);
