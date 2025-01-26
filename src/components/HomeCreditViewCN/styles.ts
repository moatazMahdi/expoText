import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  I18nManager,
  ImageStyle,
} from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  shadowContainer: ViewStyle;
  sectionsContainer: ViewStyle;
  selectedSection: ViewStyle;
  notSelectedSection: ViewStyle;
  sectionBaseStyle: ViewStyle;
  sectionText: TextStyle;
  creditText: TextStyle;
  limitText: TextStyle;
  limitTextUnderLine: TextStyle;
  upgradeText: TextStyle;
  loanIconTypeContainer: ViewStyle;
  loanImage: ImageStyle;
  loanTypeText: TextStyle;
  loanItemContainer: ViewStyle;
  loanNameText: TextStyle;
  loanNamePriceContainer: ViewStyle;
  loanPriceText: TextStyle;
  loanColumnData: ViewStyle;
  manageMyCreditContainer: ViewStyle;
  manageCreditSvg: ViewStyle;
  manageMyCreditText: TextStyle;
  ecomSvg: ViewStyle;
  appliedText: TextStyle;
  getStartedContainer: ViewStyle;
  arrowSVG: ViewStyle;
  sectionTextSelected: TextStyle;
  actionContainer: ViewStyle;
  buttonStyle: ViewStyle;
  disapprovedImage: ImageStyle;
  sideImage: ImageStyle;
  variantImage: ImageStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    spacing: { spacing },
    palette: { primary, secondary, common },
  } = theme;

  return {
    container: {
      width: wp(343),
      backgroundColor: common.white,
      flexDirection: 'column',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(216, 218, 239, 1)',
      paddingHorizontal: wp(15),
      paddingBottom: hp(15),
      paddingTop: hp(15),
      alignSelf: 'center',
      marginBottom: hp(15),
      position: 'relative',
    },
    shadowContainer: {
      shadowColor: 'rgba(216, 218, 239, 1)',
      shadowOffset: {
        width: 0,
        height: hp(8),
      },
      shadowOpacity: 1,
      shadowRadius: 10,
    },
    sectionsContainer: {
      marginBottom: hp(15),
      flexGrow: 1,
      //  marginStart: wp(30)
      justifyContent: 'center',
    },
    sectionBaseStyle: {
      paddingVertical: hp(11),
      paddingHorizontal: wp(25),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: wp(2),
      width: wp(170),
    },
    selectedSection: {
      backgroundColor: common.darkOrange,
    },
    notSelectedSection: {
      backgroundColor: common.white,
      // borderWidth: 1,
      // borderColor: common.darkBlue
    },
    sectionText: {
      fontSize: hp(14),
      fontWeight: 'bold',
    },
    sectionTextSelected: {
      color: common.white,
      fontSize: hp(14),
      fontWeight: 'bold',
    },
    creditText: {
      fontSize: hp(32),
      fontWeight: 'bold',
      marginBottom: hp(12),
    },
    limitText: {
      fontSize: hp(11),
      fontWeight: 'bold',
    },
    limitTextUnderLine: {
      fontSize: hp(11),
      color: common.darkOrange,
      fontWeight: 'bold',
    },
    upgradeText: {
      fontSize: hp(12),
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
    loanItemContainer: {
      width: '100%',
      marginBottom: hp(5.5),
    },
    loanIconTypeContainer: {
      width: '100%',
      flexDirection: 'row',
      marginBottom: hp(5),
    },
    loanImage: {},
    loanTypeText: {
      color: common.darkBlue,
      fontSize: hp(12),
      marginStart: wp(8),
      fontWeight: '400',
    },
    loanColumnData: {
      width: '100%',
      paddingStart: wp(25),
    },

    loanNamePriceContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(5),
    },
    loanNameText: {
      fontWeight: '700',
      flex: 1,
      marginEnd: wp(1),
      fontSize: hp(13),
    },
    loanPriceText: {
      fontSize: hp(13),
      fontWeight: '700',
    },
    manageMyCreditContainer: {
      flexDirection: 'row',
      marginStart: wp(8),
      alignItems: 'center',
    },
    manageCreditSvg: {
      height: hp(28),
      width: wp(19),
    },
    manageMyCreditText: {
      fontSize: hp(15),
      fontWeight: '700',
      color: common.darkBlue,
      marginStart: wp(8),
    },
    ecomSvg: {
      alignSelf: 'center',
    },
    appliedText: {
      fontSize: hp(14),
      fontWeight: '400',
    },
    getStartedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(15),
    },
    actionContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonStyle: {
      width: wp(147),
      height: hp(36),
    },
    arrowSVG: {
      marginStart: wp(3),
      width: wp(31.55),
      height: hp(15.62),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg',
        },
      ],
    },
    disapprovedImage: {
      width: wp(122),
      height: hp(142),
      alignSelf: 'center',
    },
    variantImage: {
      width: wp(100),
      height: hp(100),
      alignSelf: 'center',
      marginVertical: hp(18),
    },
    sideImage: {
      width: wp(24),
      height: hp(24),
    },
  };
};

export default StyleSheet.create(styles);
