import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { hp, wp } from 'src/utils/Dimensions/dimen';
const { width } = Dimensions.get('window');

interface IStyles {
  mainContainer: ViewStyle;
  renderAddtionalDocsDescriptionContainer: ViewStyle;
  addtionalDocsDescription: TextStyle;
  employmentStatusContainer: ViewStyle;
  cardContainer: ViewStyle;
  cardLabel: TextStyle;
  selectedCardContainer: ViewStyle;
  almostDoneImage: ViewStyle;
  continueButton: ViewStyle;
  imageStyle: ImageStyle;
  ModalSeparator: ViewStyle;
  ButtonNextSty: ViewStyle;
  TextButtonNextSty: TextStyle;
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
      // marginBottom: hp(50)
    },
    imageStyle: {
      width: 164,
      height: 164,
      alignSelf: 'center',
      marginTop: hp(56),
      borderRadius: 80,
      backgroundColor: '#F0F4F8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    renderAddtionalDocsDescriptionContainer: {
      marginHorizontal: wp(60),
      alignSelf: 'flex-start',
      paddingTop: hp(21),
    },
    addtionalDocsDescription: {
      fontSize: hp(16),
      fontFamily: I18nManager.isRTL ? fonts.arabic : fonts.regular,
      color: common.darkBlue,
      fontWeight: '400',
      alignSelf: 'center',
      textAlign: 'center',
      marginBottom: hp(10),
    },
    employmentStatusContainer: {
      width: width - wp(20),
      alignSelf: 'center',
      // padding: wp(5),
      // backgroundColor: 'red'
    },
    cardContainer: {
      width: (width - wp(40)) / 2 - wp(10),
      height: hp(133),
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
      paddingStart: wp(20),
      paddingTop: hp(18),
      borderWidth: 1,
      borderColor: common.creamyWhite,
    },
    almostDoneImage: {
      alignSelf: 'center',
      marginBottom: hp(20),
      // backgroundColor: 'red'
    },
    continueButton: {},
    ModalSeparator: {
      width: 50,
      height: 5,
      borderRadius: 5,
      backgroundColor: '#98A2B3',
      alignSelf: 'center',
      marginBottom: 20,
    },
    ButtonNextSty: {
      // position: 'absolute',
      // bottom: 8,
      height: 48,
      borderRadius: 48,
      backgroundColor: '#FD8326',
    },
    TextButtonNextSty: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },
  };
};

export default StyleSheet.create(styles);
