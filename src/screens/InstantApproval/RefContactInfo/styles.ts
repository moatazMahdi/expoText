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
  refContactNameContainer: ViewStyle;
  refContactNumberContainer: ViewStyle;
  refContactNameInput: TextStyle;
  refContactNumberInput: TextStyle;
  refContactDescriptionContainer: ViewStyle;
  refContactDescription: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
    },
    refContactNameContainer: {
      width: width - wp(40),
      alignSelf: 'center',
      borderRadius: hp(20),
      borderWidth: 1,
      borderColor: common.darkBlue,
      height: hp(60),
      alignItems: 'center',
      paddingHorizontal: wp(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(10),
    },
    refContactNameInput: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      width: width - wp(95), // 40 for marginHorizontal + 35 for contactUpload svg + 20 for paddingHorizontal
      // backgroundColor: 'red',
    },
    refContactNumberContainer: {
      // backgroundColor: 'red',
      width: width - wp(40),
      alignSelf: 'center',
      borderRadius: hp(20),
      borderWidth: 1,
      borderColor: common.darkBlue,
      height: hp(60),
      paddingHorizontal: wp(10),
      paddingVertical: hp(5),
      marginTop: hp(10),
    },
    refContactNumberInput: {
      flex: 1,
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
    },
    refContactDescriptionContainer: {
      alignSelf: 'center',
      paddingHorizontal: wp(42),
    },
    refContactDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      marginBottom: hp(10),
      textAlign: 'center',
    },
  };
};

export default StyleSheet.create(styles);
