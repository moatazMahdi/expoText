import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  PannerHomeContainer: ViewStyle;
  headerContainer: ViewStyle;
  BillPaymentIcon: ImageStyle;
  buttonStyle: ViewStyle;
  buttonsContainer: ViewStyle;
  compactCardContainer: ViewStyle;
  CardContainer: ViewStyle;
  iconNameContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    PannerHomeContainer: {
      width: '100%',
      alignSelf: 'center',
      marginTop: hp(22),
      marginBottom: hp(27),
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    BillPaymentIcon: {
      width: wp(21),
      height: hp(24),
    },
    buttonStyle: {
      width: wp(153),
      height: hp(36),
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    compactCardContainer: {
      width: wp(98.33),
      height: hp(87),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: common.white,
    },
    CardContainer: {
      width: wp(338),
      height: hp(87),
      backgroundColor: common.white,
      alignSelf: 'center',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingStart: wp(14),
    },
    iconNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  };
};

export default StyleSheet.create(styles);
