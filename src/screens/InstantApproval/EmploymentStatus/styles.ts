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
  employmentStatusDescriptionContainer: ViewStyle;
  employmentStatusDescription: TextStyle;
  employmentStatusContainer: ViewStyle;
  cardContainer: ViewStyle;
  cardLabel: TextStyle;
  selectedCardContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const { fonts } = Assets;
  const {
    palette: { common },
  } = theme;

  return {
    mainContainer: {
      flex: 1,
      backgroundColor: common.backGroundColor,
    },
    employmentStatusDescriptionContainer: {
      width: width - wp(45),
      alignSelf: 'center',
    },
    employmentStatusDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      marginBottom: hp(10),
      alignSelf: 'flex-start',
    },
    employmentStatusContainer: {
      width: width - wp(20),
      alignSelf: 'flex-start',
      // padding: wp(5),
      // backgroundColor: 'red'
    },
    cardContainer: {
      width: (width - wp(40)) / 2 - wp(10),
      height: hp(134),
      backgroundColor: common.white,
      borderRadius: wp(20),
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingStart: wp(20),
      paddingTop: hp(18),
      borderWidth: 1,
      borderColor: common.creamyWhite,
    },
    cardLabel: {
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      fontWeight: '700',
      fontSize: hp(14),
      color: common.darkBlue,
      marginVertical: hp(10),
      marginTop: hp(20),
    },
    selectedCardContainer: {
      width: (width - wp(40)) / 2 - wp(10),
      height: hp(134),
      backgroundColor: common.creamyWhite,
      borderRadius: wp(20),
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingStart: wp(20),
      paddingTop: hp(18),
      borderWidth: 1,
      borderColor: common.creamyWhite,
    },
  };
};

export default StyleSheet.create(styles);
