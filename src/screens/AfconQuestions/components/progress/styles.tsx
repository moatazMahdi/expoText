import {
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  stepsContainer: ViewStyle;
  container: ViewStyle;
  renderDiamondView: ViewStyle;
  diamondView: ViewStyle;
  diamondNumber: TextStyle;
  diamondContainer: ViewStyle;
  diamond: ImageStyle;
  diamondAnswers: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    stepsContainer: {
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      marginHorizontal: wp(20),
      marginVertical: hp(24),
    },
    container: {
      width: '100%',
      borderRadius: 10,
      paddingHorizontal: wp(10),
      paddingVertical: hp(10),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    renderDiamondView: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
    },
    diamondView: {
      position: 'relative',
      alignSelf: 'center',
    },
    diamondNumber: {
      position: 'absolute',
      alignSelf: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: common.white,
      top: Platform.OS === 'ios' ? hp(8) : hp(3),
    },
    diamondContainer: {
      width: wp(80),
      height: hp(40),
      paddingHorizontal: wp(8),
      paddingVertical: hp(12),
      borderRadius: 25,
      marginStart: wp(12),
      backgroundColor: '#ECF2FE',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    diamond: {
      width: wp(18),
      height: hp(18),
    },
    diamondAnswers: {
      fontSize: 13,
      fontWeight: '600',
      color: common.darkBlue,
      alignSelf: 'center',
    },
  };
};

export default StyleSheet.create(styles);
