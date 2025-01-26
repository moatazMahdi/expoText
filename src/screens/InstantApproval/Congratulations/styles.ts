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
  mainContainer: ViewStyle;
  congratulationsSVGWrapper: ViewStyle;
  limitText: TextStyle;
  visitNearestBranchWrapper: ViewStyle;
  visitNearestBranchText: TextStyle;
  congratulationsDescription: TextStyle;
  congratulationsCTAsWrapper: ViewStyle;
  filledButtonContainer: ViewStyle;
  filledButtonText: TextStyle;
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
    congratulationsSVGWrapper: {
      width: width - wp(45),
      height: hp(300),
      alignSelf: 'center',
      // backgroundColor: 'red',
    },
    limitText: {
      fontSize: hp(31),
      color: common.darkOrange,
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontWeight: '700',
      alignSelf: 'center',
      textAlign: 'center',
      // left: .17 * width,
    },
    visitNearestBranchWrapper: {
      width: wp(165),
      height: hp(130),
      alignSelf: 'center',
      borderRadius: hp(20),
      backgroundColor: common.white,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginStart: wp(15),
      paddingStart: wp(10),
    },
    visitNearestBranchText: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontWeight: '700',
      color: common.darkBlue,
      marginTop: hp(10),
      maxWidth: wp(130),
    },
    congratulationsDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontWeight: '400',
      textAlign: 'center',
      alignSelf: 'center',
      color: common.darkBlue,
      marginHorizontal: wp(20),
      marginVertical: hp(10),
    },
    congratulationsCTAsWrapper: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
    },
    filledButtonContainer: {
      width: width - wp(40),
      height: hp(40),
      alignSelf: 'center',
      marginVertical: hp(20),
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: hp(20),
      borderTopRightRadius: hp(20),
      borderBottomLeftRadius: hp(20),
      borderBottomRightRadius: hp(20),
      backgroundColor: common.lightOrange,
    },
    filledButtonText: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontSize: hp(20),
      color: common.white,
      fontWeight: '400',
      textAlign: 'center',
    },
  };
};

export default StyleSheet.create(styles);
