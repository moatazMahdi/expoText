import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
const { width } = Dimensions.get('window');

interface IStyles {
  container: ViewStyle;
  continueLaterDescription: TextStyle;
  filledButtonContainer: ViewStyle;
  textButtonContainer: ViewStyle;
  continueLaterButtonsContainer: ViewStyle;
  filledButtonText: TextStyle;
  textButtonTitle: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    container: {
      flex: 1,
      backgroundColor: common.backGroundColor,
    },
    continueLaterDescription: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(16),
      color: common.darkBlue,
      marginHorizontal: wp(22),
      lineHeight: hp(23),
      marginVertical: hp(30),
    },
    filledButtonContainer: {
      marginBottom: hp(10),
    },
    filledButtonText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(20),
      color: common.white,
      fontWeight: '400',
      textAlign: 'center',
    },
    continueLaterButtonsContainer: {
      flex: 1,
      alignSelf: 'center',
      bottom: 0,
      justifyContent: 'flex-end',
    },
    textButtonContainer: {
      width: width - wp(40),
      height: hp(40),
      alignSelf: 'center',
      marginBottom: hp(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textButtonTitle: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(20),
      color: common.darkBlue,
      fontWeight: '400',
      textAlign: 'center',
    },
  };
};

export default StyleSheet.create(styles);
