import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  searchContainer: ViewStyle;
  SearchIconContainer: ViewStyle;
  headerText: TextStyle;
  arrowStyle: ViewStyle;
  dropShadow: ViewStyle;
  textInputStyle: ViewStyle | TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
    statusBarHeight
  } = theme;

  return {
    container: {
      width: '100%',
      backgroundColor: common.transparent,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: wp(10),
      paddingTop: hp(statusBarHeight + 10),
      paddingBottom: hp(11)
    },
    searchContainer: {
      width: wp(335),
      minHeight: hp(50),
      paddingVertical: hp(5.5),
      backgroundColor: common.white,
      marginTop: hp(statusBarHeight),
      flexDirection: 'row',
      borderRadius: 43,
      borderWidth: 1,
      borderColor: common.veryLightGrey,
      alignItems: 'center'
    },
    SearchIconContainer: {
      width: hp(35),
      height: hp(35),
      backgroundColor: common.white,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: wp(11)
    },
    headerText: {
      color: common.lightSilver,
      marginStart: wp(15),
      fontSize: hp(16)
    },
    arrowStyle: {
      alignSelf: 'center',
      marginStart: I18nManager.isRTL ? 0 : wp(16),
      marginEnd: !I18nManager.isRTL ? 0 : wp(16)
    },
    dropShadow: {
      shadowColor: 'rgba(0, 0, 0, 0.03)',
      shadowOffset: {
        width: 0,
        height: hp(8)
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      alignItems: 'center',
      backgroundColor: 'transparent',
      marginTop: hp(18),
      paddingBottom: hp(20)
    },
    textInputStyle: {
      width: '90%',
      borderRadius: 20,
      marginStart: wp(20),
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: I18nManager.isRTL ? 'right' : 'left'
    }
  };
};

export default StyleSheet.create(styles);
