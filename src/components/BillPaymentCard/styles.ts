import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  PannerHomeContainer: ViewStyle;
  headerContainer: ViewStyle;
  BillPaymentIcon: ImageStyle;
  buttonStyle: ViewStyle;
  buttonsContainer: ViewStyle;
  optionsContainer: ViewStyle;
}

const styles = (): IStyles => {
  return {
    PannerHomeContainer: {
      width: '100%',
      alignSelf: 'center',
      minHeight: hp(20),
      backgroundColor: 'white',
      justifyContent: 'center',
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
      width: wp(147),
      height: hp(36),
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(22),
      marginBottom: hp(27),
    },
  };
};

export default StyleSheet.create(styles);
