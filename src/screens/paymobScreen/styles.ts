import { StyleSheet, ViewStyle } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  backContainer: ViewStyle;
  backArrowArabic: ViewStyle;
  backButton: ViewStyle;
  indicatorContainer: ViewStyle;
  lottieContainer: ViewStyle;
  loadingStyle: ViewStyle;
  fullScreen: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
    spacing: { spacing },
  } = theme;

  return {
    indicatorContainer: {
      width: '100%',
      height: '100%',
      flex: 1,
      backgroundColor: common.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      width: '100%',
      height: '100%',
      flex: 1,
      backgroundColor: common.transparent,
    },
    backContainer: {
      marginTop: spacing(5),
      marginLeft: spacing(2),
      justifyContent: 'center',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      backgroundColor: common.transparent,
    },
    backArrowArabic: {
      transform: [
        {
          rotateZ: '180deg',
        },
      ],
    },
    backButton: {
      backgroundColor: common.transparent,
      height: spacing(5),
      width: spacing(5),
      borderRadius: spacing(5),
      padding: spacing(1),
      justifyContent: 'center',
      alignItems: 'center',
    },
    lottieContainer: {
      width: wp(100),
      height: hp(100),
      position: 'absolute',
      alignSelf: 'center',
    },
    loadingStyle: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: hp(400),
    },
    fullScreen: { width: '100%', height: '100%' },
  };
};

export default StyleSheet.create(styles);
